const getCoinBaseData = require('./exchanges/coinbase.js');
const getKrakenData = require('./exchanges/kraken.js');
const getBinanceData = require('./exchanges/binance.js');

async function requestBitcoinNodeData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(undefined);
    }, 3000);
  })
}

function parseBitcoinNodeData(bitcoinNodeData) {
  return {"entry": "bitcoin-node", ...bitcoinNodeData};
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
