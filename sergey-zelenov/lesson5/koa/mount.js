'use strict';

const koa = require('koa');
const mount = require('koa-mount');
const Router = require('koa-router');

const app = koa();

const webmoneyRouter = new Router();

webmoneyRouter.get('/callback', function*(next) {
  this.body = `Webmoney ${this.path}`;
});

const paypalRouter = new Router();

paypalRouter.get('/callback', function*(next) {
  this.body = `Paypal ${this.path}`;
});


function* payment(next) {
  yield* mount('/webmoney', webmoneyRouter.middleware()).call(this, next);
  yield* mount('/paypal', paypalRouter.middleware()).call(this, next);
}

app.use(mount('/payment', payment));

app.listen(3000);
