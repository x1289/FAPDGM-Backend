const https = require('https');

async function getBlockchainInfo() {
  return new Promise((resolve, reject) => {
    const url = 'https://btc.getblock.io/mainnet/rest/chaininfo.json';
    const options = {method: 'GET', headers: {
      Accept: 'application/json',
      'User-Agent': 'FAPDGM',
      'x-api-key': process.env.GETBLOCK_API_KEY
    }};
    let b = Buffer.from([]);
    return https.get(url, options, (res) => {
      res.on('data', (d) => {
        b = Buffer.concat([b, Buffer.from(d)] )
      });
      res.on('end', () => {
        resolve(b.toString())
      })
    });
  }).then((response) => {
    return parseBlockChainInfo(response);
  })
  .catch((err) => {
    console.error(err);
  });
}

function parseBlockChainInfo(response) {
  if (typeof response !== 'object') response = JSON.parse(response);
  if (response['blocks'] !== undefined && response['difficulty'] !== undefined && response['verificationprogress'] !== undefined
  && response['size_on_disk'] !== undefined && response['bestblockhash'] !== undefined) {
    return {
      "blockchaininfo": {
        "blocks": response['blocks'],
        "difficulty": response['difficulty'],
        "verificationprogress": response['verificationprogress'],
        "sizeondisk": response['size_on_disk'],
        "bestblockhash": response['bestblockhash']
      }
    };
  }
}

async function getBlock(blockHash) {
  return new Promise((resolve, reject) => {
    const url = `https://btc.getblock.io/mainnet/rest/block/notxdetails/${blockHash}.json`;
    const options = {method: 'GET', headers: {
      Accept: 'application/json',
      'User-Agent': 'FAPDGM',
      'x-api-key': process.env.GETBLOCK_API_KEY
    }};
    let b = Buffer.from([]);
    return https.get(url, options, (res) => {
      res.on('data', (d) => {
        b = Buffer.concat([b, Buffer.from(d)] )
      });
      res.on('end', () => {
        resolve(b.toString())
      })
    });
  }).then((response) => {
    return parseBlock(response);
  })
  .catch((err) => {
    console.error(err);
  });
}

function parseBlock(response) {
  if (typeof response !== 'object') response = JSON.parse(response);
  if (response['confirmations'] !== undefined && response['size'] !== undefined
  && response['merkleroot'] !== undefined && response['nonce'] !== undefined && response['nTx'] !== undefined) {
    return {
      "block": {
        "confirmations": response['confirmations'],
        "size": response['size'],
        "merkleroot": response['merkleroot'],
        "nonce": response['nonce'],
        "nTx": response['nTx']
      }
    }
  }
  return response;
}

async function getChainTXStats() {
  return new Promise((resolve, reject) => {
    const url = 'https://btc.getblock.io/mainnet/';
    const options = {method: 'POST', headers: {
      Accept: 'application/json',
      'User-Agent': 'FAPDGM',
      'x-api-key': process.env.GETBLOCK_API_KEY
    }};
    let b = Buffer.from([]);
    const req = https.request(url, options, (res) => {
      res.on('data', (d) => {
        b = Buffer.concat([b, Buffer.from(d)] )
      });
      res.on('end', () => {
        resolve(b.toString())
      })
    });
    req.write(JSON.stringify({
      "jsonrpc": "2.0",
      "method": "getchaintxstats",
      "params": [
          null,
          null
      ],
      "id": "getblock.io"
  }));
  req.end();
  }).then((response) => {
    return parseChainTXStats(response);
  })
  .catch((err) => {
    console.error(err);
  });
}

function parseChainTXStats(response) {
  if (typeof response !== 'object') response = JSON.parse(response)?.result;
  if (response['txcount'] !== undefined && response['window_block_count'] !== undefined && response['window_interval'] !== undefined && response['txrate'] !== undefined) {
    const minutesPerBlock = response['window_interval'] / (60 * response['window_block_count']);
    return {
      "chaintxstats": {
        "count": response['txcount'],
		    "blockcount": response['window_block_count'],
		    "txrate": response['txrate'],
		    "minutesperblock": minutesPerBlock
      }
    }
  }
}

async function getMempoolInfo() {
  return new Promise((resolve, reject) => {
    const url = `https://btc.getblock.io/mainnet/rest/mempool/info.json`;
    const options = {method: 'GET', headers: {
      Accept: 'application/json',
      'User-Agent': 'FAPDGM',
      'x-api-key': process.env.GETBLOCK_API_KEY
    }};
    let b = Buffer.from([]);
    return https.get(url, options, (res) => {
      res.on('data', (d) => {
        b = Buffer.concat([b, Buffer.from(d)] )
      });
      res.on('end', () => {
        resolve(b.toString())
      })
    });
  }).then((response) => {
    return parseMempoolInfo(response);
  })
  .catch((err) => {
    console.error(err);
  });
}

function parseMempoolInfo(response) {
  if (typeof response !== 'object') response = JSON.parse(response);
  if (response['size'] !== undefined && response['bytes'] !== undefined && response['total_fee'] !== undefined && response['mempoolminfee'] !== undefined) {
    return {
      "mempoolinfo": {
        "size": response['size'],
        "bytes": response['bytes'],
        "minfee": response['mempoolminfee'],
        "totalfee": response['total_fee'],
      }
    }
  }
}

async function getUptime() {
  return new Promise((resolve, reject) => {
    const url = 'https://btc.getblock.io/mainnet/';
    const options = {method: 'POST', headers: {
      Accept: 'application/json',
      'User-Agent': 'FAPDGM',
      'x-api-key': process.env.GETBLOCK_API_KEY
    }};
    let b = Buffer.from([]);
    const req = https.request(url, options, (res) => {
      res.on('data', (d) => {
        b = Buffer.concat([b, Buffer.from(d)] )
      });
      res.on('end', () => {
        resolve(b.toString())
      })
    });
    req.write(JSON.stringify({
      "jsonrpc": "2.0",
      "method": "uptime",
      "params": [],
      "id": "getblock.io"
  }));
  req.end();
  }).then((response) => {
    return parseUptime(response);
  })
  .catch((err) => {
    console.error(err);
  });
}

function parseUptime(response) {
  if (typeof reponse !== 'object') response = JSON.parse(response);
  if (response?.result) return {"uptime": response.result};
}

module.exports = {
  getBlockchainInfo,
  getBlock,
  getChainTXStats,
  getMempoolInfo,
  getUptime
};
