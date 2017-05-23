const LocalStrategy = require('passport-local').Strategy;
const { User } = require('users');

module.exports = new LocalStrategy({
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
);
