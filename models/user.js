// схема и модель для бд пользователя

const mongoose = require('mongoose');
const validEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const ErrorLogin = require('../errors/ErrorLogin');

const { REG_LINK } = require('../constants/constants');

// схема бд пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => REG_LINK.test(v),
      message: 'Адрес картинки аватара некорректен',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // все адреса должныбыть уникальными, по ним идет логин
    validate: {
      validator: (valueEmail) => validEmail(valueEmail),
      message: 'Введен некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // необходимо добавить поле select чтобы не возвращался хэш пароля
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorLogin('Ошибка email или пароля'));
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return Promise.reject(new ErrorLogin('Ошибка email или пароля'));
          }
          return user;
        });
    });
};

// создали модель и экспортировали ее
module.exports = mongoose.model('user', userSchema);
