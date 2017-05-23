'use strict';

const Router = require('koa-router');

module.exports = (app) => {
  const router = new Router();

  router.get ('/',       require('./frontpage').get);
  router.post('/login',  require('./login').post);
  router.post('/logout', require('./logout').post);

  app.use(router.routes());
  return router;
};
