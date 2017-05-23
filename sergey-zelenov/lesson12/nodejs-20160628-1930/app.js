const path = require('path');
const fs = require('fs');

const config = require('config');

const koa = require('koa');
const mount = require('koa-mount');

require('libs/mongoose');

const app = koa();

app.keys = [config.secret];

const middlewares = fs.readdirSync(path.join(__dirname, 'modules/middlewares')).sort();

middlewares.forEach(middleware => {
  app.use(require(`middlewares/${middleware}`));
});

const { router: frontpage } = require('frontpage');
const { router: auth } = require('auth');
const { router: chat } = require('chat');

app.use(mount( '/', frontpage.middleware() ));
app.use(mount( '/auth', auth.middleware() ));
app.use(mount( '/chat', chat.middleware() ));

module.exports = app;
