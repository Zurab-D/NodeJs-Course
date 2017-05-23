'use strict';

const http = require('http');
const urlParse = require('url').parse;
const fs = require('fs');

const server = http.createServer((req, res) => {
  const urlParsed = urlParse(req.url, true);
  const pathname = decodeURI(urlParsed.pathname).toLocaleLowerCase();
  const query = urlParsed.query;
  const fn = urlParsed.query.fn || '';
  const DIR_UPLOADS = 'uploads\\';

  if (!res.write2) {
    res.write2 = res.write.bind(res);
    res.write = function(par) {
      res.write2(par + '\n');
    };
  };

  if (!console.log2) {
    console.log2 = console.log;
    console.log = function() {
      args.unshift('zurab:: ');
      console.log2.apply(console, arguments)
    };
  };

  res.write('pathname="' + pathname + '"');
  res.write('fn="' + fn + '"');
  if (pathname === '/getfile' && fn) {
    fs.readFile(fn, (err, data) => {
//console.log(err);
      if (err) {
        res.end('Error reading file "'+fn+'" : ' + err.message);
//console.log('Error reading file "'+fn+'" : ' + err.message);
      } else {
//console.log('data = ' + data);
//console.log('here putting out file');
        //res.end('here putting out file "' + fn + '"');
        res.end(data);
      }
    });
  } else if (pathname === '/writefile' && fn) {
    fs.stat(DIR_UPLOADS + fn, function(err, stats) {
      if (err && err.code === 'ENOENT') {
        fs.writeFile(DIR_UPLOADS + fn, 'Hello Node.js', (err) => {
          if (err) throw err;
          console.log('It\'s saved!');
          res.end('It\'s saved!');
        });
      } else {
        res.end('File "'+DIR_UPLOADS+fn+'" allredy exists');
      }
    });
  } else {
//console.log('[?] pathname="' + pathname + '"');
    res.end('[?] pathname="' + pathname + '"');
  }
  //res.end('ы'); /* если раскомментировать то END в 40 строке отрабатывать не будет */
}).listen(3000);
