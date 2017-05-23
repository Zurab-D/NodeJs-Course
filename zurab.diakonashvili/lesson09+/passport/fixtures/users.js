const oid = require('../libs/oid');
require('../models/user');

exports.User = [{
  _id: oid('user-vasya'),
  email: 'vasya@javascript.ru',
  displayName: 'Vasya',
  password: '123456'
}, {
  _id: oid('user-petya'),
  email: 'petya@javascript.ru',
  displayName: 'Petya',
  password: '123456'
}];
