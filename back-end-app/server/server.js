const express = require('express');

const {mongoose} = require('./db/mongoose');
const {Contact} = require('./models/contact');

const app = express();

app.listen(3000, () => {
  console.log('port 3000 starts')
});