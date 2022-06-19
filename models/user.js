// схема и модель для бд пользователя

const mongoose = require('mongoose');

// схема бд пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

// создали модель и экспортировали ее
module.exports = mongoose.model('user', userSchema);
