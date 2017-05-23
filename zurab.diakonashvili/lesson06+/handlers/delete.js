'use strict';

const path = require('path');
const config = require('config');
const User = require(path.join(config.root, 'models', 'user.js'));

module.exports = function*() {
    yield this.userById.remove();

    //this.redirect('/api/users');

    this.body = 'Ok';
};
