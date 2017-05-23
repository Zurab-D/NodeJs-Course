'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// uniqueValidator validation is not atomic! unsafe!
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: "E-mail пользователя не должен быть пустым.",
    validate: [
      {
        validator: function(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        msg: 'Некорректный email.'
      }
    ],
    unique: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

userSchema.plugin(uniqueValidator, {
  message: 'Пользователь с таким email уже зарегистрирован.' }
);

module.exports = mongoose.model('User', userSchema);
