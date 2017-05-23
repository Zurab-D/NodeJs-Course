'use strict';

module.exports = function* (next) {
  try {
    yield * next;
  } catch (e) {
    // for preventing hacker attacks
    this.set('X-Content-Type-Options', 'nosniff');

    if (e.status) {
      this.status = e.status;

      this.body = {
        error: e.message
      };
    } else if (e.name == 'ValidationError') {
      // mongoose errors handling
      this.status = 400;

      var errors = {};

      for (var field in e.errors) {
        errors[field] = e.errors[field].message;
      }

      this.body = {
        errors: errors
      };
    } else {
      this.body = 'Error 500';
      this.status = 500;
      console.error(e.message, e.stack);
    }
  }
};
