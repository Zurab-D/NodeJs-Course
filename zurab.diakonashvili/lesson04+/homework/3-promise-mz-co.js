'use strict';

const mz = require('mz/fs');
const co = require('co');


function* myGen (dirName) {
    let result = yield mz.readdir(dirName);

    result = yield Promise.all(result.map(file => mz.stat(file)));

    return result.reduce((sum, curr) => sum + curr.size, 0);
};


co(myGen(__dirname))
    .then(res => console.log('all size: ' + res))
    .catch(console.error);
