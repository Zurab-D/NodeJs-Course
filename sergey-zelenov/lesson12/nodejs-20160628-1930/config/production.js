const path = require('path');
const url = require('url');

const { port, hostname, auth } = url.parse(process.env.REDISCLOUD_URL);

module.exports = {
  server: {
    port: process.env.PORT
  },
  root: process.cwd(),
  jade: {
    basedir: path.join(process.cwd(), 'templates'),
    cache: true,
    pretty: true
  },
  secret: process.env.SECRET,
  crypto: {
    hash: {
      length: 128,
      iterations: 12000
    }
  },
  mongoose: {
    uri: process.env.MONGODB_URI,
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
    hostname,
    port,
    auth: auth.split(':')[1]
  }
}
