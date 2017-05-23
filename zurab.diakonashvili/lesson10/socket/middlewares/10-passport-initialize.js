'use strict';

const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


// Serializing
// save user session on the server on login
passport.serializeUser((user, done) => {
  done(null, user.id); // uses _id as idFieldd
});

// check logged in user using session data
passport.deserializeUser((id, done) => {
  /* callback version checks id validity automatically
  id got from session saved on the server */
  User.findById(id, done);
});


// Strategies
passport.use(require('../strategies/local'));
passport.use(require('../strategies/vkontakte'));
passport.use(require('../strategies/facebook'));


// Export Initialize()
const passportInitialize = passport.initialize();

module.exports = function* (next) {
  Object.defineProperty(this, 'user', {
    get: function() {
      return this.req.user;
    }
  });

  yield passportInitialize.call(this, next);
};
