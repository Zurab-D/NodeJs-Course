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
const mongoose = require('./libs/mongoose');
const Router = require('koa-router');

const app = koa();

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});

// ---------------------------------------

// can be split into files too

const router = new Router();

router.get('/', require('./routes/frontpage').get);
router.post('/login', require('./routes/login').post);
router.post('/logout', require('./routes/logout').post);
router.get('/auth/vkontakte', require('./routes/vkontakte').auth);
router.get('/auth/vkontakte/callback', require('./routes/vkontakte').callback);

router.get('/auth/facebook', require('./routes/facebook').auth);
router.get('/auth/facebook/callback', require('./routes/facebook').callback);

app.use(router.routes());

app.listen(3000);
