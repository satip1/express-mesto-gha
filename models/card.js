// схема и модель БД карточек

const mongoose = require('mongoose');

const { REG_LINK } = require('../constants/constants');

// схема бд карточек
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => REG_LINK.test(v),
      message: 'Адрес картинки аватара некорректен',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создали модель и экспортировали ее
module.exports = mongoose.model('card', cardSchema);
