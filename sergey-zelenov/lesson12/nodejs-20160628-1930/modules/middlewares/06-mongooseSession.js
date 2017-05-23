const session = require('koa-generic-session');
const sessionStore = require('libs/sessionStore');

module.exports = session({
  store: sessionStore
});
