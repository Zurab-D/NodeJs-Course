const mongoose = require('mongoose');
const co = require('co');

mongoose.connect('mongodb://localhost/test');

co(function* () {

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

  const collections = yield new Promise((resolve, reject) => {
    db.listCollections().toArray((err, items) => {
      if (err) return reject(err);
      resolve(items);
    });
  });

  const collectionNames = collections
    .map(collection => {
      if (collection.name.indexOf('system.') === 0) {
        return null;
      }
      return collection.name;
    })
    .filter(Boolean);

  return yield Promise.all(
    collectionNames.map(collectionName => {
      return new Promise((resolve, reject) => {
        db.dropCollection(collectionName, err => {
          if (err) return reject(err);
          resolve(`successfully remove collection ${collectionName}`);
        });
      });
    })
  );
})
.catch(err => console.error(err))
.then(res => {
  console.log(res);
  mongoose.disconnect();
});
