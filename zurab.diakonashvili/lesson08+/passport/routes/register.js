'use strict';

const passport = require('koa-passport');
const config = require('config');
const path = require('path');
const User = require(path.join(config.root, 'models', 'user'));

module.exports = function*(next) {
    let { email, password } = this.request.body;

    let user = yield User.findOne({ email: email });

    if (!user) {
        user = yield User.create({
            displayName: email,
            email: email,
            password: password
        });
    }

    console.log('=================================>>> ROUTES\\REGISTER.JS :: passport.authenticate');
    yield passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
    });
};
