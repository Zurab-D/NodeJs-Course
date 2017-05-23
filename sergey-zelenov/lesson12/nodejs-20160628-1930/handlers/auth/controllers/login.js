const passport = require('koa-passport');

exports.post = function*(next) {
  var ctx = this;

  // only callback-form of authenticate allows to assign ctx.body=info if 401
  yield passport.authenticate('local', function* (err, user, info) {
    if (err) throw err;
    if (user === false) {
      return ctx.redirect('/');
    } else {
      yield ctx.login(user);
    }

    ctx.redirect('/chat');
  });
};
