const passport = require('koa-passport');
const User = require('../models/user');

const localStrategy = require('../strategies/local');
const vkontakteStrategy = require('../strategies/vkontakte');
const facebookStrategy = require('../strategies/facebook');

passport.serializeUser((user, done) => {
  done(null, user.id); // uses _id as idFieldd
});

passport.deserializeUser((id, done) => {
  User.findById(id, done); // callback version checks id validity automatically
});

// done(null, user)
// OR
// done(null, false, { message: <error message> })  <- 3rd arg format is from built-in messages of strategies
passport.use(localStrategy);
passport.use(vkontakteStrategy);
passport.use(facebookStrategy);

module.exports = passport.initialize();
