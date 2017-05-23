'use strict';

const config = require('config');
const path = require('path');
const User = require(path.join(config.root, 'models', 'user'));

module.exports = function(router) {
  return function*() {
    // найти в базе по this.params.id пользователя
    let user = yield User.findOne({ verificator: this.params.id });

    // верифицировать его,
    if (user) {
      if (!user.verified) {
        try {
          user.verified = new Date();
          yield user.save();
          this.body = user.displayName + ', seccessfully verified your email';
        } catch(err) {
          this.body = user.displayName + ', error when verifying your email';
        };
      } else {
        this.body = user.displayName + ', your email is allredy virified!';
      };
    };
  };
};
