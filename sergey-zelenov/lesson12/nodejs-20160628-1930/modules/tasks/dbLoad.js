const fs = require('fs');
const co = require('co');
const path = require('path');
const gutil = require('gulp-util');
const root = require('config').get('root');

const createEmptyDB = require('../libs/db/createEmptyDb');
const loadModels = require('../libs/db/loadModels');

module.exports = () => {
  return co(function* () {
    const args = require('yargs')
      .usage('gulp db:load --from fixture/init')
      .demand(['from'])
      .describe('from', 'file to import')
      .argv;

    gutil.log('remove data from database');

    yield* createEmptyDB();

    const dbPath = path.join(root, args.from);

    gutil.log(`loading db ${dbPath}`);

    yield* loadModels(dbPath);

    gutil.log(`loaded db ${dbPath}`);
  });
};
