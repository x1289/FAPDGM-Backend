const express = require('express')
const app = express()
const port = 3000

const defaultValues = require('./default.json');

app.get('/', (req, res) => {
  res.json(defaultValues);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})