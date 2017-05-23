'use strict';

const request = require('request-promise');

Promise.all([
  request('http://yandex.ru').catch(err => err),
  request('http://google.com').catch(err => err),
  request('bad-url').catch(err => err)
])
.then(console.log)
.catch(console.error);
