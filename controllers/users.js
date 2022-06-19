// контроллер для пользователей по запросам

// подключились к схеме
const User = require('../models/user');
const { ValidationError } = require('../errors/errors');

// обработка ошибки валидации
const validData = (data, message) => {
  if (!data) throw new ValidationError(message);
}

// обработка остальных ошибок
const errorDefault = (req, res, err) {
  const message = `${req.name}: ${req.message}`;
  res.status(err.status).send({ message });
}

// запрос всех пользователей
module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(500).send({ message: `Запрос списка всех пользователей. Ошибка: ${err}` }));
  next();
};

// запрос по userId
module.exports.getIdUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      validData(user, 'Пользователь с данным id не найден');
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(err.statusCode).send({ message: err.message })
      next();
    });
};

// создаем пользователя
module.exports.creatUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  // создаем пользователя
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send({ message: `Запрос на создание пользователя. Ошибка: ${err}` }));
  next();
};

// обновляем данные пользователя
module.exports.patchUserData = (req, res, next) => {
  const owner = req.user._id; // заглушка
  const { name, about } = req.body;

  // обновляем данные
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      const message = 'Пользователь с id не найден';
      validData(user, message);
      // if (!user) { throw new Error('Пользователь с id не найден'); }
      res.send({ message: 'Данные пользователя обновили' });
    })
    .catch((err) => errorDefault(req, res, err));
  next();
};

// обновляем аватар пользователя
module.exports.patchUserAvatar = (req, res, next) => {
  const owner = req.user._id; // заглушка
  const { avatar } = req.body;

  // обновляем аватар
  User.findByIdAndUpdate(owner, { avatar: avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: `Запрос на обновление аватара пользователя. Ошибка: ${err}` }));
  next();
};
