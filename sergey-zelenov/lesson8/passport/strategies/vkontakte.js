const User = require('../models/user');
const VkontakteStrategy = require('passport-vkontakte').Strategy;
const config = require('config');
const co = require('co');

module.exports = new VkontakteStrategy(
  {
    clientID: config.auth.providers.vkontakte.appId,
    clientSecret: config.auth.providers.vkontakte.appSecret,
    callbackURL: 'http://localhost:3000/auth/vkontakte/callback',
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, oauthResponse, profile, done) {
    if (!oauthResponse.email) {
      done(null, false, {message: 'нужен email'});
    }

    co(function* () {
      const user = yield User.findOne({
        email: oauthResponse.email
      });

      if (user) return done(null, user);

      return yield User.create({
        email: oauthResponse.email,
        displayName: profile.displayName
      });
    })
    .then(
      user => {
        done(null, user);
      },
      err => {
        done(err);
      }
    );
  }
);
