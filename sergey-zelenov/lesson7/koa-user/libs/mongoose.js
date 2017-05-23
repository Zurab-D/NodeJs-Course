'use strict';

const mongoose = require('mongoose');
const config = require('config');
mongoose.Promise = Promise;

mongoose.set('debug', true);

mongoose.connect('mongodb://localhost/' + config.get('dbName'), {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});

module.exports = mongoose;
