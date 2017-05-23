'use strict';

// -- Long stack trace (+clarify from co) if needed ----------
if (process.env.TRACE) {
    require('./libs/trace');
}
console.log('== process.env.TRACE = ' + !!process.env.TRACE);


const koa = require('koa');
const Router = require('koa-router');
const handlers = require('./handlers');
const middlewares = require('./middlewares');

const app = koa();


// Load middlewares
middlewares(app);


handlers(app);


module.exports = app;
