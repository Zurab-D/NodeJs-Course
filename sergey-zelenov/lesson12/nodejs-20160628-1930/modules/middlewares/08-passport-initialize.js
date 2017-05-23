const passport = require('koa-passport');
const { User } = require('users');

passport.serializeUser((user, done) => {
  done(null, user.id); // uses _id as idFieldd
});

passport.deserializeUser((id, done) => {
  User.findById(id, done); // callback version checks id validity automatically
});

module.exports = passport.initialize();
