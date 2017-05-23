const mongoose = require('../mongoose');
const co = require('co');

module.exports = function*() {
  let db;

  if (mongoose.connection.readyState == 1) { // connected
    db = mongoose.connection.db;
  } else {
    db = yield new Promise(resolve => {
      mongoose.connection.on('open', () => {
        resolve(mongoose.connection.db);
      });
    });
  }

  yield* clearDatabase(db);

  yield* ensureIndexes();

  yield* ensureCapped();

};

function *clearDatabase(db) {

  const collections = yield new Promise((resolve, reject) => {
    db.listCollections().toArray((err, items) => {
      if (err) return reject(err);
      resolve(items);
    });
  });

  const collectionNames = collections
    .map(collection => {
      //console.log(collection.name);
      //var collectionName = collection.name.slice(db.databaseName.length + 1);
      if (collection.name.indexOf('system.') === 0) {
        return null;
      }
      return collection.name;
    })
    .filter(Boolean);

  return collectionNames.map(name => {
    return new Promise((resolve, reject) => {
      db.dropCollection(name, err => {
        if (err) reject(err);
        resolve();
      });
    });
  });

}

function *ensureIndexes(db) {

  yield mongoose.modelNames().map(modelName => {
    const model = mongoose.models[modelName];
    return new Promise(resolve => {
      model.ensureIndexes(resolve);
    });
  });

}


// ensure that capped collections are actually capped
function *ensureCapped(db) {

  yield mongoose.modelNames().map(modelName => {
    const model = mongoose.models[modelName];
    const schema = model.schema;
    if (!schema.options.capped) return;

    return new Promise((resolve, reject) => {
      db.command({
        convertToCapped: model.collection.name,
        size: schema.options.capped
      }, err => {
        if (err) reject(err);
        resolve();
      });
    })
  });
}
