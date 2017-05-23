'use strict';

const path = require('path');
const config = require('config');
const User = require(path.join(config.root, 'models', 'user.js'));

exports.getUsers = function*() {
    this.body = yield User.find({}, {__v:0}).sort({email:1})/*.lean()*/;
};

exports.getUserById = function*() {
    this.body = yield this.userById.toObject();
};

exports.renderPost = function*() {
    yield this.render('post', {});
};

exports.renderDelete = function*() {
    yield this.render('delete', {});
};
