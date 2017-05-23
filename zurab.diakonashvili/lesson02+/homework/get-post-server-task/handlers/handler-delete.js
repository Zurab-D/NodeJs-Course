'use strict';

const path = require('path');
const fileDelete = require(path.join(rootDir, 'libs', 'file-delete'));

module.exports = (fileName, res) => {
    fileDelete(path.join(filesDir, fileName), res);
};
