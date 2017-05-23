'use strict';

const {
  createReadStream,
  createWriteStream
} = require('fs');

const readableStream = createReadStream(__filename);
const writableStream = createWriteStream('out');

readableStream.pipe(writableStream);

// error
// close

// open
// data


httpserver

request → res.end()
