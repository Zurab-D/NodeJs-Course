'use strict';

const config = require('config');
const path = require('path');
const randomize = require('randomatic');

const User = require(path.join(config.root, 'models', 'user'));
const mailer = require(path.join(config.root, 'libs', 'mailer'));

module.exports = function*(next) {
  let { email, password } = this.request.body;

  let user = yield User.findOne({ email: email });

  const verificator =  Date.now() + randomize('a0', 20);

  if (!user) {
    user = yield User.create({
      displayName: email,
      email: email,
      verificator: verificator,
      password: password
    });
  }

  let response;

  try {
    response = yield mailer({
      subject: "Verify your email address",
      text: `http://${config.host}:${config.port}/verify/${verificator}`,
      html: `Click here to veify your email: <a href="http://${config.host}:${config.port}/verify/${verificator}">http://${config.host}:${config.port}/verify/${verificator}</a>`
    });
    console.log('Message sent: ' + response);
  } catch(error) {
    console.error(error);
  };

  this.redirect('/');
};
