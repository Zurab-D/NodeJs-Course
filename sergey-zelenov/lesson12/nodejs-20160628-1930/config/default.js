const path = require('path');

module.exports = {
  server: {
    port: '3000'
  },
  root: process.cwd(),
  jade: {
    basedir: path.join(process.cwd(), 'templates'),
    cache: false,
    pretty: true
  },
  secret: 'mysecret',
  crypto: {
    hash: {
      length: 128,
      // may be slow(!): iterations = 12000 take ~60ms to generate strong password
      iterations: 1
    }
  },
  mongoose: {
    uri: 'mongodb://localhost/chat-app',
    options: {
      server: {
        socketOptions: {
          keepAlive: 1
        },
        poolSize: 5
      }
    }
  },
  redis: {
    hostname: 'localhost',
    port: '6379',
    auth: ''
  }
}
