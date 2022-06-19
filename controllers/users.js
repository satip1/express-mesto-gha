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
  const { nameUser, aboutUser } = req.body;

  // обновляем данные
  User.findByIdAndUpdate(owner, { name: nameUser, about: aboutUser }, { new: true })
    .then((user) => res.send({ message: `Данные пользователя обновили` }))
    .catch((err) => res.status(500).send({ message: `Запрос на обновление данных пользователя. Ошибка: ${err}` }));
};

// обновляем аватар пользователя
module.exports.patchUserAvatar = (req, res) => {
  const owner = req.user._id; // заглушка
  const { avatarUser } = req.body;
  // проверяем данные о пользователе
  if (!avatarUser) return res.status(400).send({ message: 'Ошибка: пустое имя пользователя' });
  User.findById(owner)
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Ошибка: пользователь с таким id не найден' });
    })
    .catch((err) => res.status(500).send({ message: `Запрос на создание пользователя. Ошибка: ${err}` }));

  // обновляем аватар
  User.findByIdAndUpdate(owner, { avatar: avatarUser }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: `Запрос на обновление аватара пользователя. Ошибка: ${err}` }));
};
