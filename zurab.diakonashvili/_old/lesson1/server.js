'use strict';

const http = require('http');
const handler = require('handlers');
const log = require('loger')(module);

function run() {
  const server = new http.Server();

  server.on('request', handler);

  server.listen(3000);
  log('listener started at localhost:3000');
}

if (module.parent) {
  module.exports = run;
} else {
  run();
};
