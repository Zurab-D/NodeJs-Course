'use strict';

const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret:   'mysecret',
  mongoose: {
    uri: 'mongodb://localhost/app',
    options: {
      server: {
        socketOptions: {
          keepAlive: 1
        },
        poolSize: 5
      }
    }
  },
  crypto: {
    hash: {
      length: 128,
      // may be slow(!): iterations = 12000 take ~60ms to generate strong password
      iterations: process.env.NODE_ENV == 'production' ? 12000 : 1
    }
  },
  template: {
    // template.root uses config.root
    root: defer(cfg => {
      return path.join(cfg.root, 'templates');
    })
  },
  host: 'localhost',
  port: 3000,
  root: process.cwd(),
  auth: {
    providers: {
      vkontakte: {
        appId: '5567547',
        appSecret: 'jwis1ITDx6VnyzZfSjVn'
      },
      facebook: {
        appId: '1394568027236540',
        appSecret: 'ca022439647c1ffaca1d504b4d253578'
      }
    }
  }
};
