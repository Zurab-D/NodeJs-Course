'use strict';

// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
const views = require('koa-views');
const config = require('config');
const path = require('path');

module.exports = views(path.join(config.root, 'templates'), {
  extension: 'jade'
});
