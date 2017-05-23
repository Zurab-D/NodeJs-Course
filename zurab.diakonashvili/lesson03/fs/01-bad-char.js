'use strict';

const { createReadStream } = require('fs');

const fileStream = createReadStream(
  'bad-char.txt',
  {
    highWaterMark: 9,
    encoding: 'utf-8'
  }
);

var content = '';
fileStream.on('data', function(data) {
  content += data;
  console.log(data.toString());
});

fileStream.on('end', function() {
  console.log(content);
});
