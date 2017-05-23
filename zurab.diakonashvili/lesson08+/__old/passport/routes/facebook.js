const passport = require('koa-passport');

exports.auth = function* (next) {
  yield passport.authenticate('facebook', { scope: ['email'] });
};

exports.callback = function* () {
  yield passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  });
}
