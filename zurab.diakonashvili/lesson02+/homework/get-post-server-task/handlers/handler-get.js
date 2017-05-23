'use strict';

const path = require('path');
//const fileSend = require(rootDir + '/libs/file-send');
const fileSend = require(path.join(rootDir, 'libs', 'file-send'));

module.exports = (fileName, res) => {
    let filePath = '';

    if (!fileName) {
        filePath = path.join(publicDir, '/index.html');
    } else {
        filePath = path.join(filesDir, fileName);
    };

    fileSend(filePath, res);
};
