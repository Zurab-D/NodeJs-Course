'use strict';

const config = require('config');
const path = require('path');
const mongoose = require(path.join(config.root, 'db'));
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: "E-mail пользователя не должен быть пустым.",
        unique: true,
    },
});

userSchema.plugin(uniqueValidator, {
  message: 'Пользователь с таким email уже зарегистрирован.' }
);

let User = mongoose.model('User', userSchema);

module.exports = User;
