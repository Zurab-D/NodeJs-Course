'use strict';

/* Вопросы
  - почему не работают блоки помеченные  [[ ??? ]]
  - см. вопрос в chat.js
*/

const fs      = require('fs');
const path    = require('path');
const compose = require('koa-compose');
const app     = require('koa')();
const router  = new (require('koa-router'));

const host = 'localhost';
const port = '3000';
let clients = [];


setInterval(function() {
    console.log('clients.length = '+clients.length);
}, 5000);


app.use(compose([
    require('koa-favicon')(),
    require('koa-logger')(),
    require('koa-static' )('public'),
    require('koa-bodyparser')()
]));



router.get('/subscribe', function* (next) {
  this.set("Cache-Control", "no-cache, no-store, must-revalidate");

  const msg = yield new Promise((resolve, reject) => {
    clients.push(resolve);

    this.res.on('close', function() {
      clients.splice(clients.indexOf(resolve), 1);  // [[ ??? ]] <<------------РАБОТАЕТ !?
      reject('----->> client closed');
    });
  });
  this.body = msg;
});



router.post('/publish', function*(next) {
  const { message } = this.request.body; console.log('=========================>>> message = ' + message);

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

app.listen(port, host, () => console.log(`http://${host}:${port}`));
