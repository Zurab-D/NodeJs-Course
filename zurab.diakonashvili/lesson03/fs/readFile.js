'use strict';

const fs = require('fs');

const stream = fs.createWriteStream('copy', {flags: 'wx+'});

fs.createReadStream('nonempty.txt').pipe(stream);
fs.createReadStream('nonempty.txt').pipe(stream);
