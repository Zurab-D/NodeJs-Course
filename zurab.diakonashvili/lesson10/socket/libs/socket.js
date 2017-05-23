const Cookies = require('cookies');
const config = require('config');
const mongoose = require('mongoose');
const co = require('co');
const User = require('../models/user');

const socketIO = require('socket.io');
const socketEmitter = require('socket.io-emitter');

const redisClient = require('redis').createClient({ host: 'localhost', port: 6379 });

const socketRedis = require('socket.io-redis');

const sessionStore = require('./sessionStore');



function socket(server) {
  const io = socketIO(server);

  io.adapter(socketRedis(redisClient));

  io.use((socket, next) => {
    const handshakeData = socket.request; // createServer((req, res))

    const cookies = new Cookies(handshakeData, {}, config.keys);

    const sid = `koa:sess:${cookies.get('koa.sid')}`;

    co(function*() {
      const session = yield* sessionStore.get(sid, true);

      if (!session) {
        throw new Error('No session');
      }

      if (!session.passport && !session.passport.user) {
        throw new Error('Anonymous session not allowed');
      }

      // if needed: check if the user is allowed to join
      // this - koa; socket - socket.io
      socket.user = yield User.findById(session.passport.user);

      // if needed later: refresh socket.session on events
      socket.session = session;

      session.socketIds = session.socketIds ?
        session.socketIds.concat(socket.id) :
        [socket.id];

      console.log('session.socketIds:');
      console.log(session.socketIds);

      yield* sessionStore.save(sid, session);

      socket.on('disconnect', () => {
        co(function* clearSocketId() {
          const session = yield* sessionStore.get(sid, true);
          if (session) {
            session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
            yield* sessionStore.save(sid, session);
          }
        }).catch(function(err) {
          console.error('session clear error', err);
        });
      });

    }).then(function() {
      next();
    }).catch(function(err) {
      next(err);
    });

  });

  io.on('connection', (socket) => {
    io.emit('message', socket.user.displayName, 'hello');
  });
}



socket.emitter = socketEmitter(redisClient);

module.exports = socket;
