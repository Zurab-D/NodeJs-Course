'use strict';

const fs = require('mz/fs');

fs.readdir(__dirname)
    .then(filesNames => Promise.all(
        filesNames.map(fileName => {
            return fs.stat(fileName).then(stat => {
                return {name: fileName, stat: stat};
            });
        })
      )
    )
    .then(stats => stats.filter(
        statsObj => statsObj.stat.isFile()
    ))
    .then(stats => stats.reduce(
        (sum, statsObj) => {
            console.log(`${statsObj.name}: ${statsObj.stat.size}`);
            return sum + statsObj.stat.size;
        }, 0
    ))
    .then(console.log)
    .catch(error => console.log(error));
