const passport = require('koa-passport');
const User = require('../models/user');

const localStrategy = require('../strategies/local');
const vkontakteStrategy = require('../strategies/vkontakte');
const facebookStrategy = require('../strategies/facebook');

// save user session on the server on login
passport.serializeUser((user, done) => {
    console.log('=================================>>> passport.serializeUser');
    done(null, user.id); // uses _id as idFieldd
});

// check logged in user using session data
passport.deserializeUser((id, done) => {
    console.log('=================================>>> passport.de-serializeUser');
    // callback version checks id validity automatically
    // id got from session saved on the server
    User.findById(id, done);
});

// done(null, user)
// OR
// done(null, false, { message: <error message> })  <- 3rd arg format is from built-in messages of strategies
passport.use(localStrategy);
passport.use(vkontakteStrategy);
passport.use(facebookStrategy);

module.exports = passport.initialize();
