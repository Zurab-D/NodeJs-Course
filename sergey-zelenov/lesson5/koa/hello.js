'use strict';

const koa = require('koa');

const app = koa(); // createServer

/**
 * Основные объекты:
 * this.req / this.res
 * this.request / this.response
 * this (контекст)
 *
 * Основные методы:
 * this.set/get
 * this.body=
 */
app.use(function*() {

  /* sleep(1000); */
  yield new Promise(resolve => {
    setTimeout(resolve, 4000);
  });

  // this.body = "hello"; // {result: "hello"}
});

app.listen(3000);
