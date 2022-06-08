const requestData = require('./requestData.js');

let intervalTimer;

function init() {
  if (!intervalTimer) {
    intervalTimer = setInterval(() => {
      requestData()
      .then((data) => {
        console.log('data', data);
      })
    }, 3000); 
  }
}

module.exports = init;