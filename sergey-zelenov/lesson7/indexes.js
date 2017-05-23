'use strict';

const co = require('co');

const mongoose = require('mongoose');
mongoose.set('debug', true);

mongoose.connect('mongodb://localhost/test', {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

const mary = new User({
  email: 'mary@mail.com'
});


co(function* () {
  // yield User.remove({});
  return yield mary.save();
})
.then(console.log)
.catch(console.error)
.then(() => {
  mongoose.disconnect();
})
