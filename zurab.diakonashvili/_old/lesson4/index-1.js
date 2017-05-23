'use strict';

const http = require('http');
const fs = require('mz/fs');
const dir = __dirname;

const server = http.createServer((req, res) => {
  fs.readdir(dir).then(files => {
console.log(files);
    files = files.reduce((checkedFiles, current) => {
console.log('checkedFiles = ' + checkedFiles);
      fs.stat(current, stat => {
        if (stat.isFile()) checkedFiles.push(current);
      });
    }, []);
console.log(files);
    Promise.all(
      files.map(file => fs.readFile(file, 'utf-8'))
    ).then(data => {
      var totalLength = data.reduce((sum, current) => {
        return sum + current.length;
      }, 0);
      res.end('Total files length = ' + totalLength);
    })
  });
  //res.end();
}).listen(3000);
