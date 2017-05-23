'use strict';

/**
 * A "closer to real-life" app example
 * using 3rd party middleware modules
 * P.S. MWs calls be refactored in many files
 */

// -- Long stack trace (+clarify from co) if needed ----------
if (process.env.TRACE) {
    require('./libs/trace');
}
console.log('== process.env.TRACE = ' + !!process.env.TRACE);


const koa = require('koa');
const config = require('config');
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');


var clients = [];
const app = koa();


// -- Keys for in-koa KeyGrip cookie signing (used in session, maybe other modules) ----------
app.keys = [config.secret];


// -- Middlewares ----------
let middlewares = fs.readdirSync(
    path.join(__dirname, 'middlewares')
).sort().filter(file => fs.statSync(`./middlewares/${file}`).isFile());

middlewares.forEach(middleware => {
    let middlewareObj = require(`./middlewares/${middleware}`);
    if (typeof middlewareObj === 'function') app.use(middlewareObj);
});


// -- Router ----------
const router = new Router();

router.get('/views', function* (next) {
  let count = this.session.count || 0;
  this.session.count = ++count;
  this.session.name = 'asdfasdf';
  this.session.value = {
    year: 120210,
    asdf: 'asdfasdf'
  };

  yield this.render('index', {
    user: 'Johny',
    count
  });
});

router.get('/subscribe', function*() {
    this.set('Cache-Control', 'no-cache, must-revalidate');

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
    this.body = 'Ok';
});


app.use(router.routes());


// -- Export ----------
module.exports = app;
