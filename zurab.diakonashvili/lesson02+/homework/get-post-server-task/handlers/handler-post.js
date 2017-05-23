'use strict';

const path = require('path');
const fileReceive = require(path.join(rootDir, 'libs', 'file-receive'));

module.exports = (fileName, req, res) => {
    if (!fileName) {
        res.statusCode = 404;
        res.end('Not found');
    } else {
        fileReceive(path.join(filesDir, fileName), req, res);
    }
};
