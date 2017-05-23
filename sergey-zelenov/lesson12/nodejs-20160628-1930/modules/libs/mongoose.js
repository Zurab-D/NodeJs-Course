/**
 * This file must be required at least ONCE.
 * After it's done, one can use require('mongoose')
 *
 * In web-app: this is done at init phase
 * In tests: in mocha.opts
 * In gulpfile: in beginning
 */

const mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = Promise;

if (process.env.MONGOOSE_DEBUG) {
  mongoose.set('debug', true);
}

mongoose.connect(config.get('mongoose.uri'), config.get('mongoose.options'));

module.exports = mongoose;
