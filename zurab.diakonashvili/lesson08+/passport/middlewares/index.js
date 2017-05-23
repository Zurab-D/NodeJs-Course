'use strict';

/** Reqiure all middlewares in current dir */

const fs = require('fs');
const config = require('config');
const path = require('path');

const middlewaresDir = path.join(config.root, 'middlewares');


function fullPath (file) {
    return path.join(middlewaresDir, file)
};


module.exports = function(app) {
    let files =
        fs.readdirSync(middlewaresDir)
        .sort()
        .filter(file => fs.statSync(fullPath(file)).isFile() && file != path.basename(__filename).toLowerCase())
    ;

    files.forEach(file => {
        let middlewareObj = require(fullPath(file));
        if (typeof middlewareObj === 'function') app.use(middlewareObj);
    });
};
