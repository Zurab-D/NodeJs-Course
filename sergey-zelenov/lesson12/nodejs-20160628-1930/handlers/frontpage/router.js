const Router = require('koa-router');
const { mustNotBeAuthenticated } = require('auth');

const frontpage = require('./controllers/frontpage');

const router = module.exports = new Router();

router
  .get('/', mustNotBeAuthenticated, frontpage.get);
