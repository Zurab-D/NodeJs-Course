'use strict';

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

const koa = require('koa');
const config = require('config');
const mongoose = require('./libs/mongoose');
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const User = require('./libs/user');

const app = koa();

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) {
  app.use(require(`./middlewares/${middleware}`));
});

// ---------------------------------------

// can be split into files too
const router = new Router({
  prefix: '/api/users'
});

router
  .param('userById', function* (id, next) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.throw(404);
    }

    this.userById = yield User.findById(id);

    if (!this.userById) {
      this.throw(404);
    }

    yield* next;
  })
  .post('/', function* (next) {
    const user = yield User.create({
      email: this.request.body.email
    });

    this.body = user.toObject();
  })
  .get('/:userById', function* (next) {
    this.body = this.userById.toObject();
  })
  .del('/:userById', function* (next) {
    yield this.userById.remove();
    this.body = 'ok';
  })
  .get('/', function*(next) {
    const users = yield User.find({}).lean();

    this.body = users;
  });

app.use(router.routes());

app.listen(3000);
