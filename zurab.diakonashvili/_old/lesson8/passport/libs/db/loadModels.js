const mongoose = require('../mongoose');
const co = require('co');

// tried using pow-mongoose-fixtures,
// but it fails with capped collections, it calls remove() on them => everything dies
// so rolling my own tiny-loader
module.exports = function* (data) {
  const modelsData = (typeof data == 'string') ? require(data) : data;

  for(let modelName in modelsData) {
    const Model = mongoose.models[modelName];
    yield Model.remove({});
    yield* loadModel(Model, modelsData[modelName]);
  }
};

// load data into the DB, replace if _id is the same
function *loadModel(Model, entities) {
  return yield Promise.all(
    entities.map(entity => {
      return Model.create(entity);
    })
  );
}
