const https = require('https');
const { Buffer } = require('node:buffer');

async function requestData() {
  return new Promise((resolve, reject) => {
    const url = 'https://api3.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","BTCEUR","BTCGBP"]';
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
  let result = {"exchange": "binance"};
  response.forEach((entry) => {
    if (entry?.symbol === 'BTCUSDT') {
      result["usd"] = entry?.price;
    } else if (entry?.symbol === 'BTCEUR') {
      result["eur"] = entry?.price;
    } else if (entry?.symbol === 'BTCGBP') {
      result["gbp"] = entry?.price;
    }
    // We calculate jpy price based on usd price and usd/jpy exchange rate, because jpy trading was suspended on binance
    result["jpy"] = '' + Number(result["usd"]) * 134,1;
  })
  result["usd"]
  return result;
}

async function getBinanceData() {
  return requestData()
  .then((response) => {
    return parseData(response)
  })
}

module.exports = getBinanceData;
