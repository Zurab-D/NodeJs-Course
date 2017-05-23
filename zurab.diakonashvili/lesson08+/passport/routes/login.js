const passport = require('koa-passport');

exports.post = function*(next) {
  console.log('==============================>>> ROUTES\LOGIN.JS :: passport.authenticate');
  yield passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  });

};
