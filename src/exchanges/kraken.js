const https = require('https');
const { Buffer } = require('node:buffer');

async function requestData(ticker) {
  return new Promise((resolve, reject) => {
    const url = `https://api.kraken.com/0/public/Ticker?pair=${ticker}`;
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
  let result = {"exchange": "kraken"};
  response.forEach((entry) => {
    if (typeof entry === 'string') entry = JSON.parse(entry);
    if (entry?.result["XXBTZUSD"]) {
      result["usd"] = entry?.result["XXBTZUSD"].o;
    } else if (entry?.result["XXBTZEUR"]) {
      result["eur"] = entry?.result["XXBTZEUR"].o;
    } else if (entry?.result["XXBTZGBP"]) {
      result["gbp"] = entry?.result["XXBTZGBP"].o;
    } else if (entry?.result["XXBTZJPY"]) {
      result["jpy"] = entry?.result["XXBTZJPY"].o;
    }
  });
  return result;
}

async function getKrakenData() {
  return Promise.all([requestData('BTCUSD'), requestData('BTCEUR'), requestData('BTCGBP'), requestData('BTCJPY')])
  .then((response) => {
    return parseData(response)
  })
}

module.exports = getKrakenData;
