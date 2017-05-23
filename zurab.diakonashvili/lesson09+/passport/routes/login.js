'use strict';

const passport = require('koa-passport');

/*exports.post = function*(next) {
  yield passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  });
};*/


exports.post = function*(next) {
  var self = this;

  yield passport.authenticate('local', function* (err, user, info) {
    if (err) throw err;

    if (!user) {
      if (info.status) self.status = info.status
      else self.status = 401;
      self.body = self.status +' :: '+ info.message;
    } else {
      yield self.login(user);
      self.redirect('/');
    }
  });
};
