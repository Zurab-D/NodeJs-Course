// Какие здесь возможны ошибки? Как правильно?

var zlib = require('zlib');
var fs = require('fs');

fs.createReadStream('test.gz')
  .on('error', handleError)
  .pipe(zlib.createGunzip())
  .on('error', handleError)
  .pipe(fs.createWriteStream('test'))
  .on('error', handleError)
  .on('finish', function() {
    console.log("DONE");
  });
