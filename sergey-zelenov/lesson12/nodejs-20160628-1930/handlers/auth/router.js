const Router = require('koa-router');

const login = require('./controllers/login');
const logout = require('./controllers/logout');

const router = module.exports = new Router();

router
  .post('/login', login.post)
  .post('/logout', logout.post);
