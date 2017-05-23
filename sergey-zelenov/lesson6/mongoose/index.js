'use strict';

const User = require('./user');

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

const mary1 = new User({
  // email: 'mary1@mail.com'
});

const mary2 = new User({
  email: 'mary2@mail.com'
});

const mary3 = new User({
  email: 'mary2@mail.com'
});


// no error handling here (bad)
// User.remove({}, err => {
//   mary.save((err, result) => {
//     User.findOne({
//       email: 'mary@mail.com'
//     }, (err, user) => {
//       console.log(user);
//
//       // ... do more with mary
//
//       // no unref!
//       mongoose.disconnect();
//     });
//   });
// });

co(function* () {
  yield new Promise(resolve => {
    mongoose.connection.on('connected', resolve);
  });

  console.log(mongoose.connection.readyState);

  yield User.remove({});

  yield Promise.all([
    mary1.save().catch(err => err), // return err;
    mary2.save().catch(err => err),
    mary3.save().catch(err => err)
  ]);

  // yield mary.save();
  // yield mary1.save();
  // yield mary2.save();
})
.then(console.log)
.catch(console.error)
.then(() => {
  mongoose.disconnect();
})
