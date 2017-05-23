'use strict';

const koa = require('koa');

const app = koa();

app.use(function* (next) {
  try {
    yield* next;
  } catch(err) {
    console.log(err.status);
    this.status = 500;
    this.body = 'error';
  }
});

app.use(function* () {
  this.throw(404);
});

app.listen(3000);
