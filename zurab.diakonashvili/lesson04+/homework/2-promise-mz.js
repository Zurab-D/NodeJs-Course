'use strict';

const mz = require('mz/fs');

mz.readdir(__dirname)
    .then(files => Promise.all(files.map(file => mz.stat(file))))
    .then(statsArr => {
        let result = statsArr.reduce((lengthAll, statsCurr) => {
            return lengthAll + statsCurr.size;
        }, 0);
        console.log(result);
    })
    .catch(console.log);
