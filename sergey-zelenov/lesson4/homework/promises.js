'use strict';

const fs = require('mz/fs');

fs.readdir(__dirname)
  .then(filesNames => Promise.all(
    filesNames.map(fileName => fs.stat(fileName))
  ))
  .then(stats => stats.filter(stat => stat.isFile()))
  .then(stats => {
    const length = stats.reduce((sum, {size}) => sum + size, 0);
    return length;
  })
  .then(console.log)
  .catch(err => console.error(err));
