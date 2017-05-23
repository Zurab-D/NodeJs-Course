'use strict';

const log = require('loger')(module);

log('handler is required');

function handler (req, res) {
  res.end('hi there');
  log('got browser request');
};

module.exports = handler;
