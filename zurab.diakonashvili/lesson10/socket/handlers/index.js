'use strict';

const Router = require('koa-router');
const handlerGet = require('./get');
const handlerPost = require('./post');
const handlerDelete = require('./delete');
const params = require('./params');

module.exports = app => {
    const router = new Router({prefix: '/api/users'});
    params(router);

    router.get('/post',   handlerGet.renderPost);
    router.get('/delete', handlerGet.renderDelete);
    router.get('/',       handlerGet.getUsers);
    router.get('/:id',    handlerGet.getUserById);
    router.post('/',      handlerPost);
    router.delete('/:id', handlerDelete);

    app.use(router.routes());
};
