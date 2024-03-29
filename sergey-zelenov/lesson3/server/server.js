'use strict';

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const config = require('config');

module.exports = http.createServer((req, res) => {

  const pathname = decodeURI(url.parse(req.url).pathname);
  const filename = pathname.slice(1); // /file.ext -> file.ext

  if (filename.includes('/') || filename.includes('..')) {
    res.statusCode = 400;
    res.end("Nested paths are not allowed");
    return;
  }

  if (req.method == 'GET') {
    if (pathname == '/') {
      sendFile(config.get('publicRoot') + '/index.html', res);
    } else {
      let filepath = path.join(config.get('filesRoot'), filename);
      sendFile(filepath, res);
    }
  }

  if (req.method == 'POST') {
    if (!filename) {
      res.statusCode = 404;
      res.end('path must be provided');
    }

    receiveFile(path.join(config.get('filesRoot'), filename), req, res);
  }
});

function receiveFile(filepath, req, res) {
  let size = 0;

  const writeStream = new fs.WriteStream(filepath, {flags: 'wx'});

  req
    .on('data', chunk => {
      size += chunk.length;

      if (size > config.get('limitFileSize')) {
        // early connection close before recieving the full request

        res.statusCode = 413;

        // if we just res.end w/o connection close, browser may keep on sending the file
        // the connection will be kept alive, and the browser will hang (trying to send more data)
        // this header tells node to close the connection
        // also see http://stackoverflow.com/questions/18367824/how-to-cancel-http-upload-from-data-events/18370751#18370751
        res.setHeader('Connection', 'close');

        // Some browsers will handle this as "CONNECTION RESET" error
        res.end('File is too big!');

        writeStream.destroy();
        fs.unlink(filepath, function(err) {
          /* ignore error */
        });

      }
    })
    .on('close', () => {
      writeStream.destroy();
      fs.unlink(filepath, err => { });
    })
    .pipe(writeStream);

  writeStream
    .on('error', function(err) {
      if (err.code == 'EEXIST') {
        res.statusCode = 409;
        res.end("File exists");
      } else {
        console.error(err);
        if (!res.headersSent) {
          res.writeHead(500, {'Connection': 'close'});
          res.end("Internal error");
        } else {
          res.end();
        }
        fs.unlink(filepath, err => {});
      }
      res.destroy();
    })
    .on('close', function() {
      // Note: can't use on('finish')
      // finish = data flushed, for zero files happens immediately,
      // even before "file exists" check

      // for zero files the event sequence may be:
      //   finish -> error

      // we must use "close" event to track if the file has really been written down
      res.end("OK");
    });
}


function sendFile(filepath, res) {
  let fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);

  fileStream
    .on('error', err => {
      if (err.code == 'ENOENT') {
        res.statusCode = 404;
        res.end("Not found");
      } else {
        console.error(err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("Internal error");
        } else {
          res.end();
        }

      }
    })
    .on('open', () => {
      res.setHeader('Content-Type', mime.lookup(filepath));
    });

  res
    .on('close', () => {
      fileStream.destroy();
    });
}
