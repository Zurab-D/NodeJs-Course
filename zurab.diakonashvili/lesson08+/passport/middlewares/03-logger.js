'use strict';

// request/response logger
if (process.env.TRACE) {
    const logger = require('koa-logger');
    module.exports = logger();
}
