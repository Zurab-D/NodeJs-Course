const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: 'mysecret',
  mongoose: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost/app',
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
  root: process.cwd(),
  auth: {
    providers: {
      vkontakte: {
        appId: '5567547',
        appSecret: 'jwis1ITDx6VnyzZfSjVn'
      }
    }
  }
};
