const EventEmitter = require('events');
const express = require('express')
const cors = require('cors');
const app = express()
const port = 8080

require('dotenv').config()

if (process.env.GETBLOCK_API_KEY === undefined) {
  console.error('getblock api key missing. add .env file with getblock.io api key');
  return;
}

const init = require('./src/handleData.js');
let emitter = new EventEmitter();
init(emitter);

let currentData = require('./data.json');

emitter.on('data-update', (newData) => {
  currentData = newData;
});

app.use(cors());

app.get('/', cors(), (req, res, next) => {
  res.json(currentData);
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})