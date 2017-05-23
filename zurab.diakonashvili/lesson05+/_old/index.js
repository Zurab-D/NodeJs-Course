'use strict';

if (process.env.TRACE) {
    require('./libs/trace');
}

const koa = require('koa');
const compose = require('koa-compose');
const Router = require('koa-router');

const app = koa();

const router = new Router();
const host = 'localhost';
const port = '3000';
let clients = [];


setInterval(function() {
  console.log('clients.length = '+clients.length);
}, 5000);


app.use(compose([
    require('koa-favicon')()
    ,require('koa-static' )('public')
    ,require('koa-logger')()
    ,require('koa-views')('./templates', {extenstions: 'jade'})
    ,require('./custom-middlewares/errors')
    ,require('koa-generic-session')()
    ,require('koa-bodyparser')()
    ,require('./custom-middlewares/multipartParser')
]));


router.get('/subscribe', function*() {
console.log('----->> go /subscribe');
    this.set('Cache-Control', 'no-cache,must-revalidate');

    try {
        this.body = yield new Promise((resolve, reject) => {
            clients.push(resolve);

            this.res.on('close', () => {
                clients.splice(clients.indexOf(this.res), 1);  // [[ ??? ]] <<------------РАБОТАЕТ !?
                reject('client closed');
            });
        });
    } catch(err) {
        throw err;
    }
});


router.post('/publish', function*() {
console.log('----->> go /publish');

    const message = this.request.body.message;
console.log('message = ' + message);

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
