'use strict';

const http = require('http');
const fs = require('mz/fs');
const dir = __dirname;

const server = http.createServer((req, res) => {
  fs.readdir(dir).then(files => {
    files = files.reduce((checkedFiles, current) => {
      if (fs.statSync(current).isFile()) {
        checkedFiles.push(current);
      }
      return checkedFiles;
    }, []);
    Promise.all(
      files.map(file => fs.readFile(file, 'utf-8'))
    ).then(data => {
      var totalLength = data.reduce((sum, current) => {
        return sum + current.length;
      }, 0);
      res.end('Total files length = ' + totalLength);
    })
  });
}).listen(3000, ()=>{console.log('http://localhost:3000');});
