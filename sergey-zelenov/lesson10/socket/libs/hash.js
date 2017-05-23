const crypto = require('crypto');
const config = require('config');

// warning, takes time, about ~70ms for length=128, iterations=12000
exports.createHashSlow = (password, salt) => {
  return crypto.pbkdf2Sync(
    password,
    salt,
    config.crypto.hash.iterations,
    config.crypto.hash.length,
    'SHA1'
  ).toString('base64');
};

exports.createSalt = () => {
  return crypto.randomBytes(config.crypto.hash.length).toString('base64');
};
