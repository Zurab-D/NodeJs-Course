'use strict';

const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const co = require('co');

module.exports = new FacebookStrategy(
  {
    clientID: config.auth.providers.facebook.appId,
    clientSecret: config.auth.providers.facebook.appSecret,
    callbackURL: `http://${config.host}:${config.port}/auth/facebook/callback`,
    profileFields: [ 'displayName', 'email'],
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, oauthResponse, profile, done) => {
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
