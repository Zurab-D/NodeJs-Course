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
const chat    = require('./chat');

const host = 'localhost';
const port = '3000';
//const clients = [];



app.use(function* (next) {
  console.log(`req.url = "${this.req.url}"`);
  yield* next;
})



app.use(compose([
  require('koa-favicon')(),
  require('koa-static' )('public')
]));



app.listen(port, host, () => console.log(`http://${host}:${port}`));



app.use(router.routes());



router.get('/', function*() { // [[ ??? ]] <<<------------- НЕ РАБОТАЕТ
  this.redirect('static.html');
});



router.get('/subscribe', function* (next) {
  //console.log('router got /subscribe');
  //console.log(`clients.length (beg) = ${chat.clients.length}`);

  chat.subscribe(this.req, this.res);

  //console.log(`clients.length (end) = ${chat.clients.length}`);

  yield* next;
});



router.post('/publish', function*(next) {
  console.log("router.post('/publish')");

  let body = '';

  this.req
    .on('readable', function() {
      body += this.req.read(); // [[ ??? ]] <------------------- ЗДЕСЬ ПАДАЕТ. почему?

      if (body.length > 1e4) {
        this.res.statusCode = 413;
        this.res.end("Your message is too big for my little chat");
      }
    })
    .on('end', function() {
      try {
        body = JSON.parse(body);
      } catch (e) {
        this.res.statusCode = 400;
        this.res.end("Bad Request");
        return;
      }

      chat.publish(body.message);
      this.res.end("ok");
    });

  yield* next;
});
