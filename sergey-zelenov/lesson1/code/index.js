'use strict';

const http = require('http');
const handler = require('handler');

const server = new http.Server();

const emit = server.emit;

server.emit = function() {
  console.log(arguments[0]);
  return emit.apply(server, arguments);
};

server.on('request', handler);

server.listen(3000);

// const EventEmitter = require('events').EventEmitter;
// const myEventEmitter = new EventEmitter();
// const handler = (name) => console.log(`hello ${name}`);
// myEventEmitter.on('hello', handler);
//
// myEventEmitter.emit('hello', 'Vasya');
