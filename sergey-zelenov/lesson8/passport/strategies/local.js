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
        return done(null, false, { message: 'Нет такого пользователя или пароль неверен.' });
      }

      return done(null, user);
    });
  }
);
