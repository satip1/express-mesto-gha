// контроллер для пользователей по запросам

// подключаем модуль хеширования и создания токенов
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// подключились к схеме
const User = require('../models/user');

// подключаем кастомные классы ошибок
const ErrorBadData = require('../errors/ErrorBadData'); // 400
const ErrorLogin = require('../errors/ErrorLogin'); // 401
const ErrorNotFound = require('../errors/ErrorNotFound'); // 404
const ErrorBadEmail = require('../errors/ErrorBadEmail'); // 409
const ErrorOtherError = require('../errors/ErrorBadData'); // 500

const { OK } = require('../constants/constants');

// кодовые слова и длина соли хэша
const { SECRET_CODE, HASHSALT } = require('../constants/constants');

// запрос всех пользователей
module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send({ users }))
    .catch(() => next(new ErrorOtherError('На сервере произошла ошибка')));
};

// запрос по userId
module.exports.getIdUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) res.status(OK).send({ data: user });
      else next(new ErrorNotFound('Пользователь с данным id не существует'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadData('Некорректные данные пользователя.'));
        return;
      }
      next(new ErrorOtherError('На сервере произошла ошибка'));
    });
};

// создаем пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, HASHSALT)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(OK).send({
      user: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    }))
    .catch((err) => {
       console.log(err);
      if (err.name === 'ValidatorError') {
        next(new ErrorNotFound('Некорректные данные пользователя'));
        return;
      }
      if (err.code === 11000) {
        next(new ErrorNotFound('Пользователь с данным емейл уже существует'));
        return;
      }

      next(new ErrorOtherError('На сервере произошла ошибка'));
    });
};

// обновляем данные пользователя
module.exports.patchUserData = (req, res, next) => {
  const owner = req.user._id; // заглушка
  const { name, about } = req.body;

  // обновляем данные
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) res.status(OK).send({ user });
      else next(new ErrorNotFound('Пользователь с данным id не существует'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadData('Некорректные данные пользователя.'));
        return;
      }
      next(new ErrorOtherError('На сервере произошла ошибка'));
    });
};

// обновляем аватар пользователя
module.exports.patchUserAvatar = (req, res, next) => {
  const owner = req.user._id; // заглушка
  const { avatar } = req.body;

  // обновляем аватар{ message: 'Аватар обновлен' }
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadData('Некорректные данные пользователя.'));
        return;
      }
      next(new ErrorOtherError('На сервере произошла ошибка'));
    });
};

// обработка логина
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // ищем пользователя по почте
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_CODE, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next(new ErrorLogin('Неверный email или пароль')));
};
