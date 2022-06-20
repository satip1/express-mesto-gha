// подключились к схеме
const Card = require('../models/card');
const { OK, ERROR_DATA, ERROR_NOT_FOUND, ERROR_OTHER_ERROR } = require('../errors/errors');

// запрос всех карточек
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` }));
};

// создаем новую карточку
module.exports.creatCard = (req, res) => {
  const { name, link, likes = [] } = req.body;
  const owner = req.user._id; // временная заглушка для идентификатора пользователя

  // создаем новую карточку
  Card.create({ name, link, owner, likes })
    .then((cards) => res.status(OK).send({ cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_DATA).send({ message: `Некорректные данные карточки. Ошибка: ${err.message}` });
        return;
      }
      res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

// удаляем карточку
module.exports.deleteCard = (req, res) => {
  const ownerUser = req.user._id; // временная заглушка для идентификатора пользователя

  // проверка на возможность удаления
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) return res.status(ERROR_NOT_FOUND).send({ message: 'Ошибка: карточкис таким id не найдено' });
      if (card.owner !== ownerUser) return res.status(ERROR_DATA).send({ message: 'Ошибка: вы не можете удалить эту карточку' });
    })
    .catch((err) => res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` }));

  // удаляем карточку
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.status(OK).send({ message: 'Карточка удалена' }))
    .catch((err) => res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` }));
};

// ставим лайк карточке
module.exports.putLikeCard = (req, res) => {
  const owner = req.user._id; // временная заглушка для идентификатора пользователя

  // ставим лайк
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) return res.status(ERROR_DATA).send({ message: 'Ошибка: карточки с таким id не найдено' });
      res.status(OK).send(card);
    })
    .catch((err) => res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` }));
};

// удаляем лайк карточке
module.exports.cancelLikeCard = (req, res) => {
  const owner = req.user._id; // временная заглушка для идентификатора пользователя

  // убираем лайк
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) return res.status(ERROR_DATA).send({ message: 'Ошибка: карточки с таким id не найдено' });
      res.status(OK).send(card);
    })
    .catch((err) => res.status(ERROR_OTHER_ERROR).send({ message: `На сервере произошла ошибка: ${err}` }));
};
