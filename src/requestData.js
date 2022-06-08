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
  return await Promise.all([parseBitcoinNodeData(await requestBitcoinNodeData()), parseExchangeData(await requestExchangeData())]);
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
