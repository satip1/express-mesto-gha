// контроллер для пользователей по запросам

// подключились к схеме
const User = require('../models/user');
const {
  OK, ERROR_DATA, ERROR_NOT_FOUND, ERROR_OTHER_ERROR,
} = require('../errors/errors');

// запрос всех пользователей
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send({ users }))
    .catch((err) => res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` }));
};

// запрос по userId
module.exports.getIdUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) res.status(OK).send({ user });
      else res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с данным id не существует' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: `Некорректные данные пользователя. Ошибка: ${err.message}` });
        return;
      }
      res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

// создаем пользователя
module.exports.creatUser = (req, res) => {
  const { name, about, avatar } = req.body;

  // создаем пользователя
  User.create({ name, about, avatar })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_DATA).send({ message: `Некорректные данные пользователя. Ошибка: ${err.message}` });
        return;
      }
      res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

// обновляем данные пользователя
module.exports.patchUserData = (req, res) => {
  const owner = req.user._id; // заглушка
  const { name, about } = req.body;

  // обновляем данные
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) res.status(OK).send({ user });
      else res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с данным id не существует' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_DATA).send({ message: `Некорректные данные пользователя. Ошибка: ${err.message}` });
        return;
      }
      res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

// обновляем аватар пользователя
module.exports.patchUserAvatar = (req, res) => {
  const owner = req.user._id; // заглушка
  const { avatar } = req.body;

  // обновляем аватар{ message: 'Аватар обновлен' }
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_DATA).send({ message: `Некорректные данные аватара. Ошибка: ${err.message}` });
        return;
      }
      res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};
