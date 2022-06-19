// контроллер для пользователей по запросам

// подключились к схеме
const User = require('../models/user');

// запрос всех пользователей
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(500).send({ message: `Запрос списка всех пользователей. Ошибка: ${err}` }));
};

// запрос по userId
module.exports.getIdUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ user }))
    .catch((err) => res.status(404).send({ message: `Запрос пользователя по id. Ошибка: ${err}` }));
};

// создаем пользователя
module.exports.creatUser = (req, res) => {
  const { name, about, avatar } = req.body;

  // создаем пользователя
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send({ message: `Запрос на создание пользователя. Ошибка: ${err}` }));
};

// обновляем данные пользователя
module.exports.patchUserData = (req, res) => {
  const owner = req.user._id; // заглушка
  const { name, about } = req.body;

  // обновляем данные
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true  })
    .then((user) => res.send({ message: 'Данные пользователя обновили' }))
    .catch((err) => res.status(500).send({ message: `Запрос на обновление данных пользователя. Ошибка: ${err}` }));
};

// обновляем аватар пользователя
module.exports.patchUserAvatar = (req, res) => {
  const owner = req.user._id; // заглушка
  const { avatar } = req.body;

  // обновляем аватар
  User.findByIdAndUpdate(owner, { avatar: avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: `Запрос на обновление аватара пользователя. Ошибка: ${err}` }));
};
