'use strict';

const fs = require('fs');

module.exports = (fileName, res) => {
    fs.unlink(fileName, err => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end('Not found');
            } else {
                res.statusCode = 500;
                res.end(err.message);
            };
        } else {
            res.statusCode = 200;
            res.end('Ok');
        }
    });
};
