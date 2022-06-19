const fs = require('fs-extra');
const requestData = require('./requestData.js');

let intervalTimer;

function updateLocalDataFile(emitter, data) {
  if (typeof data !== 'object') return;
  fs.readJson('./default.json')
  .then((fileContent) => {
    let newData = fileContent;
    Object.keys(data).forEach((key) => {
      if (newData[key] !== undefined) {
        newData[key] = data[key];
      }
    });
    return newData;
  })
  .then((newData) => {
    emitter.emit('data-update', newData);
    fs.writeJson('./data.json', newData);
    return newData;
  })
  .catch(err => {
    console.error(err);
  });
}

function init(emitter) {
  if (!intervalTimer) {
    intervalTimer = setInterval(() => {
      requestData()
      .then((data) => {
        updateLocalDataFile(emitter, data);
      })
    }, 10000); 
  }
}

module.exports = init;