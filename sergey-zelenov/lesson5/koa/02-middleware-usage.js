'use strict';

const koa = require('koa');
const fs = require('mz/fs');

const app = koa();

/*
  f1 -> f2 ->f3
    <-       <-
*/

// 1. Wrap into a meta function (count time, catch errors...)
app.use(function* (next) {
  // 1
  console.log('--> request start', this.url);
  // 2
  let time = Date.now();

  yield* next;
  // 10
  time = Date.now() - time;
  // 11
  console.log('<-- request end', time, 'ms');
  // node.js finished, but...
  // response body may be not yet fully sent out,
  // use on-finished for that (or see koa-logger how to track full body length)
});

// 2. Add goodies to this (or this.request/response, but not req/res)
app.use(function* (next) {
  // 3
  console.log('--> add useful method to this');
  // 4
  this.renderFile = function* (file) { // просто function без * - ошибка!
    // 7
    this.body = yield fs.readFile(file, 'utf-8');
  }.bind(this); // зафиксировали this в генераторе

  yield* next;
  // 9
  console.log('middleware that added useful method');
});

// 3. Do the work, assign this.body (or throw)
app.use(function* (next) {
  // 5
  console.log('--> work, work!');
  // 6
  if (this.url !== '/') {
    this.throw(404);
  }

  yield* this.renderFile(__filename); // если без yield, то не сработает!
  // 8
  console.log('<-- work complete, body sent!');
});

app.listen(3000);
