'use strict';

const fs = require('mz/fs');
const co = require('co');

function* findFilesLength() {
  const entities = yield fs.readdir(__dirname);

  const stats = yield Promise.all(
    entities.map(entity => fs.stat(entity))
  );

  const fileStats = stats.filter(stat => stat.isFile());

  return fileStats.reduce((sum, {size}) => sum + size, 0);
}

co(findFilesLength)
  .then(console.log)
  .catch(console.error);
