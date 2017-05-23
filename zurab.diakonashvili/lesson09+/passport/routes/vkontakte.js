'use strict';

const passport = require('koa-passport');

exports.auth = function* (next) {
  yield passport.authenticate('vkontakte', { scope: ['email'] });
};

exports.callback = function* () {
  yield passport.authenticate('vkontakte', {
    successRedirect: '/',
    failureRedirect: '/'
  });
}
