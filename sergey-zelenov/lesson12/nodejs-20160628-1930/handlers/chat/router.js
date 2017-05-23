const Router = require('koa-router');
const { mustBeAuthenticated } = require('auth');

const chatpage = require('./controllers/chat');

const router = module.exports = new Router();

router
  .get('/', mustBeAuthenticated, chatpage.get);
