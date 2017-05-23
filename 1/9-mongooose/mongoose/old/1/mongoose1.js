'use strict';

// Connecting w/ mongoose, schema, model, basic queries
const mongoose = require('mongoose');
mongoose.set('debug', true);

mongoose.connect('mongodb://localhost/test', {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});

module.exports = mongoose;
