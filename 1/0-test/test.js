'use strict';

const http = require('http');

const server = new http.Server();

server.on('request', (req, res) => {
  res.end('hello');
});

server.listen(3000);
