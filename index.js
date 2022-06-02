const express = require('express')
const cors = require('cors');
const app = express()
const port = 8080

app.use(cors());

const defaultValues = require('./default.json');

app.get('/', cors(), (req, res, next) => {
  res.json(defaultValues);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})