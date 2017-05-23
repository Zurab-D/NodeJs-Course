'use strict';

module.exports = function*(next) {
  try {
    yield* next;
  } catch (e) {
    if (e.status) {
      // could use template methods to render error page
      this.body = e.message;
      this.statusCode = e.status;
    } else {
      if (e.name === 'MongoError') {
        this.body = `User ${this.request.body.email} allredy registered!`;
        this.statusCode = 400;
        return;
      };
      this.body = "Error 500";
      this.statusCode = 500;
      console.error(e.message, e.stack);
    }
  }
};
