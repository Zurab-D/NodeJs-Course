'use strict';

const http = require('http');
const fs = require('mz/fs');

const server = http.createServer((req, res) => {
  fs.readdir(__dirname).then(files => {
    Promise.all(
      files.map(file => fs.readFile(file, 'utf-8'))
    ).then(data => {
      var totalLength = data.reduce((sum, current) => {
        return sum + current.length;
      }, 0);
      res.end('Total files length = ' + totalLength);
    })
  });
}).listen(3000);
