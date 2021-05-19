const express = require('express');
const app = express();
let Web3 = require('web3');
const EventWorker = require('./worker/index.js');

try {
  new EventWorker().watchEvents();
}
catch(error) {
  console.error(error);
}

app.listen(3000, () => console.log('Listening on port 3000!'));
