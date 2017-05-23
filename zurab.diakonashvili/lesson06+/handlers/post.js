'use strict';

const path = require('path');
const config = require('config');
const User = require(path.join(config.root, 'models', 'user.js'));

module.exports = function*() {
    let { email } = this.request.body

    let newUser = new User({
        email: email
    });

    yield newUser.save();

    //this.redirect('/api/users');
    this.body = 'Ok';
};
