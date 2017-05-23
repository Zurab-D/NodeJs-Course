'use strict';

const config = require('config');

global.publicDir = config.get('publicDir');
global.filesDir = config.get('filesDir');

module.exports = config;
