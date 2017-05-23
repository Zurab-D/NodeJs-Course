'use strict';

const http = require('http');
const fs = require('mz/fs');
const dir = __dirname;

const server = http.createServer((req, res) => {
  res.writeLn = function() {
    res.write(arguments[0] + '\n');
  }

  fs.readdir(dir)
    .then(files => {
      Promise.all(
        files.map(file => fs.readFile(file, 'utf-8'))
      ).then(data => {
        var totalLength = data.reduce((sum, current) => {
          return sum + current.length;
        }, 0);
        res.end('Total files length = ' + totalLength);
      })
    })
    .catch(err => {console.log('err=' + err.message)})
  ;
}).listen(3000);
