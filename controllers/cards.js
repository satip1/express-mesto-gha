// подключились к схеме
const Card = require('../models/card');

const ErrorOtherError = require('../errors/ErrorOtherError'); // 500
const ErrorBadData = require('../errors/ErrorBadData'); // 400
const ErrorDeleteCard = require('../errors/ErrorDeleteCard'); // 403
const ErrorNotFound = require('../errors/ErrorNotFound'); // 404

// константы кодов ошибок
const { OK } = require('../constants/constants');

// запрос всех карточек
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(() => next(new ErrorOtherError()));
};

// создаем новую карточку
module.exports.creatCard = (req, res, next) => {
  const { name, link, likes = [] } = req.body;
  const owner = req.user._id;

  // создаем новую карточку
  Card.create({
    name, link, owner, likes,
  })
    .then((cards) => res.status(OK).send({ cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadData(`Некорректные данные карточки. Ошибка: ${err.message}`));
        return;
      }
      next(new ErrorOtherError());
    });
};

// удаляем карточку
module.exports.deleteCard = (req, res, next) => {
  const ownerUser = req.user._id;
  // проверка   на возможность удаления
  // если id автора и пользователя совпадают, удалим
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Ошибка: карточкис таким id не найдено'));
        return;
      }
      if (card.owner._id.toString() !== ownerUser.toString()) {
        next(new ErrorDeleteCard('Ошибка: вы не можете удалить эту карточку'));
        return;
      }
      Card.deleteOne(card).then(() => res.status(OK).send({ message: 'Карточка удалена:' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadData(`Некорректное id карточки: ${err}`));
        return;
      }
      next(new ErrorOtherError());
    });
};

// ставим лайк карточке
module.exports.putLikeCard = (req, res, next) => {
  const owner = req.user._id;

  // ставим лайк
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Ошибка: карточкис таким id не найдено'));
        return;
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadData(`Некорректное id карточки: ${err}`));
        return;
      }
      next(new ErrorOtherError());
    });
};

// удаляем лайк карточке
module.exports.cancelLikeCard = (req, res, next) => {
  const owner = req.user._id;

  // убираем лайк
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Ошибка: карточкис таким id не найдено'));
        return;
      }
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadData(`Некорректное id карточки: ${err}`));
        return;
      }
      next(new ErrorOtherError());
    });
};
