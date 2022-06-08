const https = require('https');
const { Buffer } = require('node:buffer');

async function requestData() {
  return new Promise((resolve, reject) => {
    const url = 'https://api.coinbase.com/v2/exchange-rates?currency=BTC';
    const options = {method: 'GET', headers: {Accept: 'application/json', 'User-Agent': 'FAPDGM'}};
    let b = Buffer.from([]);
    return https.get(url, options, (res) => {
      res.on('data', (d) => {
        b = Buffer.concat([b, Buffer.from(d)] )
      });
      res.on('end', () => {
        resolve(b.toString())
      })
    });
  })
}

function parseData(response) {
  if (typeof response === 'string') response = JSON.parse(response);
  let result = {"exchange": "coinbase"};
  result["usd"] = response?.data?.rates?.USD;
  result["eur"] = response?.data?.rates?.EUR;
  result["gbp"] = response?.data?.rates?.GBP;
  result["jpy"] = response?.data?.rates?.JPY;
  return result;
}

async function getCoinBaseData() {
  return requestData()
  .then((response) => {
    return parseData(response)
  })
}

module.exports = getCoinBaseData;
