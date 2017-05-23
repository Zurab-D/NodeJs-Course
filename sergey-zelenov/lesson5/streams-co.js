'use strict';

function readStream(stream) {
  let resolve, reject;
  let finished;
  let promise;

  stream.on('data', data => resolve(data));
  stream.on('error', error => reject(error));
  stream.on('end', () => resolve());

  return function() {
    return new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
  };
}

const fs = require('fs');
const co = require('co');

co(function*() {

  let stream = fs.createReadStream(__filename, {highWaterMark: 60, encoding: 'utf-8'});

  let data;
  let reader = readStream(stream);
  while(data = yield reader()) {
    console.log(data.replace(/\n/g, /\\n/));
  }

}).catch(console.error);
