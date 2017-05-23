'use strict';

if (process.env.TRACE) {
  require('./libs/trace');
}

const koa = require('koa');
const config = require('config');
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');

const app = koa();

app.keys = [config.secret];

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(middleware => {
  app.use(require(`./middlewares/${middleware}`));
});

const router = new Router();
let clients = [];

router.get('/subscribe', function*() {
  this.set('Cache-Control', 'no-cache,must-revalidate');

  const promise = new Promise((resolve, reject) => {
    clients.push(resolve);

    this.res.on('close', () => {
      clients = clients.filter(client => client !== resolve);

      const error = new Error('Connection closed');
      error.code = 'ECONNRESET';
      reject(error);
    });
  });

  let message;

  try {
    message = yield promise;
console.log('--->> message = ' + message);
  } catch(err) {
    if (err.code == 'ECONNRESET') return;
    throw err;
  }

  this.body = message;
});

router.post('/publish', function*() {
  const { message } = this.request.body;

  if (!message) {
    this.throw(400);
  }

  clients.forEach(resolve => {
    resolve(String(message));
  });

  clients = [];
  this.body = 'ok';
});

app.use(router.routes());

app.listen(3000);
