// подключились к схеме
const Card = require('../models/card');

// запрос всех карточек
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Запрос списка всех карточек. Ошибка: ${err}` }));
};

// создаем новую карточку
module.exports.creatCard = (req, res) => {
  const { name, link, likes = [] } = req.body;
  const owner = req.user._id; // временная заглушка для идентификатора пользователя
  // проверяем данные
  if (!link) return res.status(400).send({ message: 'Ошибка в адресекартинки' });
  Card.findById(owner)
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Ошибка: пользователь с таким id не найден' });
    })
    .catch((err) => res.status(500).send({ message: `Запрос на создание пользователя. Ошибка: ${err}` }));

  // создаем новую карточку
  Card.create({ name, link, owner, likes })
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Запрос на создание карточки. Ошибка: ${err}` }));
};

// удаляем карточку
module.exports.deleteCard = (req, res) => {
  const ownerUser = req.user._id; // временная заглушка для идентификатора пользователя

  // проверка на возможность удаления
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Ошибка: карточкис таким id не найдено' });
      if (card.owner !== ownerUser) return res.status(400).send({ message: 'Ошибка: вы не можете удалить этукарточку' });
    })
    .catch((err) => res.status(500).send({ message: `Запрос на создание карточки. Ошибка: ${err}` }));

  // удаляем карточку
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => res.status(500).send({ message: `Запрос на удаление карточки. Ошибка: ${err}` }));
};

// ставим лайк карточке
module.exports.putLikeCard = (req, res) => {
  const owner = req.user._id; // временная заглушка для идентификатора пользователя
  // проверка данных
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Ошибка: карточкис таким id не найдено' });
    })
    .catch((err) => res.status(500).send({ message: `Запрос на создание карточки. Ошибка: ${err}` }));

  // ставим лайк
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Запрос на лайк карточки. Ошибка: ${err}` }));
};

// удаляем лайк карточке
module.exports.cancelLikeCard = (req, res) => {
  const owner = req.user._id; // временная заглушка для идентификатора пользователя
  // проверка данных
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Ошибка: карточкис таким id не найдено' });
    })
    .catch((err) => res.status(500).send({ message: `Запрос на создание карточки. Ошибка: ${err}` }));

  // убираем лайк
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Запрос на лайк карточки. Ошибка: ${err}` }));
};
