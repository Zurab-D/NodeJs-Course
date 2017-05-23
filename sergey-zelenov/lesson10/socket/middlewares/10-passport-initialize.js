const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id); // uses _id as idField
});

passport.deserializeUser((id, done) => {
  User.findById(id, done); // callback version checks id validity automatically
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false, { message: 'Нет такого пользователя или пароль неверен.' });
      }
      return done(null, user);
    });
  }
));

const passportInitialize = passport.initialize();

module.exports = function* (next) {
  Object.defineProperty(this, 'user', {
    get: function() {
      return this.req.user;
    }
  });

  yield passportInitialize.call(this, next);
};
