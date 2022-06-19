// контроллер для пользователей по запросам

// подключились к схеме
const User = require('../models/user');
const { ValidationError } = require('../errors/errors');

// запрос всех пользователей
module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!user) throw new ValidationError('Пользователь с данным id не найден');
      res.send({ users });
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({ message: err.message })
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
    })
  next();
};

// запрос по userId
module.exports.getIdUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new ValidationError('Пользователь с данным id не найден');
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
    .then((user) => {
      if (!user) throw new ValidationError('Некорректные данные пользователя');
      res.send({ message: 'Новый пользователь создан' });
    })
    .catch((err) => errorDefault(req, res, err));
  next();
};

// обновляем данные пользователя
module.exports.patchUserData = (req, res, next) => {
  const owner = req.user._id; // заглушка
  const { name, about } = req.body;
  // обновляем данные
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new ValidationError('Пользователь с id не найден');
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
