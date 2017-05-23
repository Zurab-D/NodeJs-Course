'use strict';

const koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const app = koa()
const router = new Router();

const config = require('config');
const host = config.get('host');
const port = config.get('port');

router.get('/', function* (next) {
  yield this.render('index')
});

app
  .use(function*(next) {
    try {
      yield* next;
    } catch(e) {
      if (e.status) {
        this.body = e.status +', '+ e.message;
      } else {
        this.body = e.message;
      }
    }
  })
  .use(function*(next) {
    //this.throw(404);
    this.body = 'Hi there!'
  })
  /*.use(function *(){
    this.body = 'Hello World';
  })*/
  .listen(port, host, () => console.log(`http://${host}:${port}`));
