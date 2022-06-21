// роутеры для пользователей
const router = require('express').Router();
const {
  getAllCards, creatCard, deleteCard,
  putLikeCard, cancelLikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', creatCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', putLikeCard);
router.delete('/cards/:cardId/likes', cancelLikeCard);

module.exports = router;
