'use strict';

// A "closer to real-life" app example
// using 3rd party middleware modules
// P.S. MWs calls be refactored in many files

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

const koa = require('koa');
const config = require('config');
const path = require('path');
const fs = require('fs');

const Router = require('koa-router');

const app = koa();

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

const middlewares = fs.readdirSync(
  path.join(__dirname, 'middlewares')
).sort();

middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});

// ---------------------------------------

// can be split into files too
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
    user: 'John',
    count
  });
});

router.get('/', function*() {
  this.redirect('/views');
});

app.use(router.routes());

app.listen(3000);
