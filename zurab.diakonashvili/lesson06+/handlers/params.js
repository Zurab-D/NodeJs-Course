'use strict';

const path = require('path');
const config = require('config');
const User = require(path.join(config.root, 'models', 'user.js'));
const mongoose = require('mongoose');

module.exports = function(router) {
    router.param('id', function*(id, next) {
       if (!mongoose.Types.ObjectId.isValid(id)) {
           this.throw(404);
       };

       this.userById = yield User.findById(id, {__v:0});

       if (!this.userById) {
           this.throw(404);
       };

       yield* next;
    });
};
