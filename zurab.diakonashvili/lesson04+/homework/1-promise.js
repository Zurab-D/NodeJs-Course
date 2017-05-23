'use strict';

const fs = require('fs');
const PARAM = process.argv[2] || '';

console.log(`PARAM : "${PARAM}"`);

function readFile (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err)
                reject(err)
            else
                resolve(data);
        });
    });
};

readFile(PARAM || __filename)
    .then(console.info)
    .catch(err => console.error('We got an error: ' + err.message))
;
