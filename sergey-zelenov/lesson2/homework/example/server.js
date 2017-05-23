'use strict';

const { Server } = require('http');
const { createReadStream } = require('fs');

const server = new Server((req, res) => {
  createReadStream(__filename).pipe(res);
});

module.exports = server;
