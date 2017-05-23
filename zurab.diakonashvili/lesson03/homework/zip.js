// Какие здесь возможны ошибки? Как правильно?

var zlib = require('zlib');
var fs = require('fs');

fs.createReadStream('test.gz')
    .on('error', err => console.log(err))
    .pipe(zlib.createGunzip())
    .on('error', err => console.log(err))
    .pipe(fs.createWriteStream('test'))
    .on('error', err => console.log(err))
    .on('finish', function() {
        console.log("DONE");
    });
