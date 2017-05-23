'use strict';

exports.post = function*(next) {
    /* CSRF checking moved to ./middlewares/csrf.js */

    this.logout();
    this.redirect('/');
};
