'use strict';

var
    url = 'mongodb://localhost:27017/mychat',
    MongoClient = require('mongodb').MongoClient,
    co = require('co')
;

function mongoConnectPromise(url) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        reject(err);
      } else {
        console.log('Connected correctly to server');
        resolve(db);
      }
    });
  });
};

function insertDocumentPromise(db, data) {
  return new Promise((resolve, reject) => {
    var collection = db.collection('documents');

    collection.insert(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log('Dcument inserted succesfully');
        resolve(collection)
      };
    });
  });
};

function getCollectionCount(collection) {
  return new Promise((resolve, reject) => {
    collection.count((err, count) => {
      if (err) {
        reject(err);
      } else {
        resolve(count);
      };
    });
  });
};


var db;
co(function* () {
    db = yield mongoConnectPromise(url);

    //let collection = yield insertDocumentPromise(db, {foo: "bar"});
    let collection = yield insertDocumentPromise(db, {a: 1});

    let count = yield getCollectionCount(collection);

    db.close();
    return count;
})
.then(count => console.log('Total records count in the collection: ' + count))
.catch(err => {
    console.error('Houston, we have a problem! => ' + err.message);
    db.close();     // [[ ??? ]]  <<<------------------------------ Как сюда передать и count и db (для вызова db.close())?
});
