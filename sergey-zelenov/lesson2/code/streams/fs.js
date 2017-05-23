'use strict';

const {
  createReadStream,
  createWriteStream,
  readFile,
  readFileSync
} = require('fs');

// Readable
const stream = createReadStream(__filename, {
  highWaterMark: 40,
  encoding: 'utf-8'
});

// stream.setEncoding('utf-8');

// Flowing | Paused

// 1 способ перевести поток в режим flowing
stream
  .on('data', chunk => {
    console.log('-----------\n');
    console.log(chunk);
    console.log('-----------\n');
  })
  .on('error', () => {
    // handle error
    stream.destroy();
  })
  .on('end', () => {
    console.log('end');
  });

// 2 способ - .pipe(writibable)
// const writableStream = createWriteStream(`${__filename}.out`);
// stream.pipe(writableStream);

// 3 способ .resume()
// stream.on('data', chunk => {
//   console.log('-----------\n');
//   console.log(chunk);
//   console.log('-----------\n');
//   stream.pause();
// });

// stream.on('readable', () => {
//   console.log(stream.read());
// });
