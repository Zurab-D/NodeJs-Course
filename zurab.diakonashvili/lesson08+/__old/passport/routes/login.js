const passport = require('koa-passport');

exports.post = function*(next) {
  yield passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  });

};
