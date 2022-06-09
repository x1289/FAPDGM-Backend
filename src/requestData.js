//#region bitcoin data
const { getBlockchainInfo, getBlock, getChainTXStats, getMempoolInfo, getUptime } = require('./bitcoin-node/bitcoinNode.js');
//#endregion
//#region exchange data
const getCoinBaseData = require('./exchanges/coinbase.js');
const getKrakenData = require('./exchanges/kraken.js');
const getBinanceData = require('./exchanges/binance.js');
//#endregion exchange data

require('dotenv').config()

async function requestBitcoinNodeData() {
  const blockchainInfoPromise = getBlockchainInfo()
  .then(async (blockchaininfo) => {
    const bestBlockHash = blockchaininfo?.blockchaininfo?.bestblockhash;
    const block = await getBlock(bestBlockHash);
    return {blockchaininfo: blockchaininfo.blockchaininfo, block: block.block}
  })
  return Promise.all([blockchainInfoPromise, getChainTXStats(), getMempoolInfo(), getUptime()]);
}

function parseBitcoinNodeData(bitcoinNodeData) {
  return bitcoinNodeData;
}

async function requestData() {
  const requestedData = await Promise.all([parseBitcoinNodeData(await requestBitcoinNodeData()), parseExchangeData(await requestExchangeData())]);
  const result = {};
  const validEntries = ['blockchaininfo', 'block', 'chaintxstats', 'mempoolinfo', 'uptime', 'price'];
  if (!requestedData) return;
  requestedData.forEach((entry) => {
      const entryName = entry?.entry;
      if (validEntries.includes(entryName)) {
        delete entry.entry;
        result[entryName] = entry;
      } else {
        entry.forEach((key) => {
          Object.keys(key).forEach((k) => {
            if (validEntries.includes(k)) result[k] = key[k];
          })
        })
      }
    });
  return result;
}

async function requestExchangeData() {
  return Promise.all([getCoinBaseData(), getKrakenData(), getBinanceData()]);
}

function parseExchangeData(exchangeData) {
  let result = {"entry": "price"};
  exchangeData.forEach((entry) => {
    if (entry.exchange) {
      const exchangeName = entry.exchange;
      delete entry.exchange;
      result[exchangeName] = entry;
    }
  });
  return result;
}

module.exports = requestData;
