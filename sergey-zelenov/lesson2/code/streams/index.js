'use strict';

// Readable | Writable | Duplex (Transform)

// Writable
const { Server } = require('http');

const server = new Server((req, res) => {
  const emit = res.emit;

  res.emit = function() {
    console.log(arguments[0]);
    return emit.apply(res, arguments);
  };

  res.write('lala');
  res.write('pqpqpq');

  res.end('lala');
});

server.listen(3000);
