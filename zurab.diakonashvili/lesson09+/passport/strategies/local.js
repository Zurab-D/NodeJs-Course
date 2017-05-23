'use strict';

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = new LocalStrategy(
  {
    usernameField: 'email', // 'username' by default
    passwordField: 'password'
  },
  (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);

      if (!user || !user.checkPassword(password)) {
        // don't say whether the user exists
        return done(null, false, { message: 'Incorrect username or password' });
      };

      if (!user.verified || user.verified < new Date(2010, 0, 1)) {
        return done(null, false, { message: 'User ' + user.displayName + ' is not virified!', status: 403 });
      };

      return done(null, user);
    });
  }
);
