'use strict';

const fs = require('fs');
const path = require('path');
const myUtils = require(path.join(rootDir, 'libs', 'my-utils'));

module.exports = (fileName, req, res) => {
    let size = 0;

    const writeStream = new fs.WriteStream(fileName, {flags: 'wx'});

    req
        .on('data', chunk => {
            size += chunk.length;

            if (size > myUtils.limitFileSize) {
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
                fs.unlink(fileName, function(err) {
                    /* ignore error */
                });

            }
        })
        .on('close', () => {
            writeStream.destroy();
            fs.unlink(fileName, err => { });
        })
        .pipe(writeStream);

    writeStream
        .on('error', function(err) {
            if (err.code == 'EEXIST') {
              res.statusCode = 409;
              res.end("File exists");
            } else {
              if (!res.headersSent) {
                res.writeHead(500, {'Connection': 'close'});
                res.end("Internal error");
              } else {
                res.end();
              }
              fs.unlink(fileName, err => {});
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
};
