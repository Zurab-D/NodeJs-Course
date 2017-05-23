'use strict';

exports.get = function*(next) {
  if (this.isAuthenticated()) {
    this.body = this.render('welcome', {
        csrf: this.csrf
    });
  } else {
    this.body = this.render('login');
  };
};
