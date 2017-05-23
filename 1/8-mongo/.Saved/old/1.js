'use strict';

var
  url = 'mongodb://localhost:27017/mychat',
  MongoClient = require('mongodb').MongoClient
;

function mongoConnectPromise(url) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        reject(err);
      } else {
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

mongoConnectPromise(url)
  .then(db => {
    console.log('Connected correctly to server');
    return insertDocumentPromise(db, {foo: "bar"});
  })
  .then(collection => {
    console.log('Dcument inserted succesfully');
    return getCollectionCount(collection);
  })
  .then(count => {
    console.log('Total records count in the collection: ' + count)
    db.close();
  })
  .catch(err => {
    db.close();
    console.log('Houston, we have a problem!\n' + err.message);
  });
