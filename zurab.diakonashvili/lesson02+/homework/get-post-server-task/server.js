'use strict';

global.rootDir = __dirname;

const http = require('http');
const config = require(rootDir + '/config');
const handlers = require('./handlers');

module.exports = http.createServer(handlers);
