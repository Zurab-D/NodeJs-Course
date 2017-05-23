'use strict';

/**
* Reqiure all middlewares in current dir with a name strting with a NUMBER
*/

const fs = require('fs');
const config = require('config');
const path = require('path');

const middlewaresDir = path.join(config.root, 'middlewares');


function fullPath (file) {
  return path.join(middlewaresDir, file)
};


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};


module.exports = function(app) {
  let files = fs.readdirSync(middlewaresDir);
    files = files.sort();
    files = files.filter( file => {
      return fs.statSync(fullPath(file)).isFile()
        && file.toLowerCase() != path.basename(__filename).toLowerCase()
        && path.extname(file).toLowerCase() === '.js'
        && isNumeric(file[0])
      ;
    });

  files.forEach(file => {
    let middlewareObj = require(fullPath(file));
    if (typeof middlewareObj === 'function') {
      app.use(middlewareObj);
    }
  });
};
