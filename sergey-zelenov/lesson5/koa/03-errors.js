'use strict';

const koa = require('koa');

const app = koa();

app.use(function*(next) {
  try {
    yield* next;
  } catch (e) {
    if (e.status) { // User error
      this.body = e.message;
      this.status = e.status;
    } else { // Server error
      this.body = 'Error 500';
      this.status = 500;
      console.error(e.message, e.stack);
    }

    // no accept header means html is returned
    const type = this.accepts('html', 'json');
    if (type === 'json') {
      this.body = {
        error: this.body
      };
    }
  }
});

app.use(function* (next) {
  switch(this.url) {
    case '/1':
      // stack trace, 500
      yield new Promise(function(resolve, reject) {
        setTimeout(reject, 1000, new Error('Error in callback'));
      });
      break;

    case '/2':
      // stack trace, 500
      throw(new Error('Error thrown'));

    case '/3':
      // user-level error (the difference: error.status), show 403
      this.throw(403);

    default:
      this.body = 'ok';
  }
});

app.listen(3000);
