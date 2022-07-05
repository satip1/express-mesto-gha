// роутеры для пользователей
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, getMeUser, getIdUser,
  patchUserData, patchUserAvatar,
} = require('../controllers/users');

const { REG_LINK } = require('../constants/constants');

router.get('/users', getAllUsers);
router.get('/users/me', getMeUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getIdUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUserData);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(REG_LINK),
  }),
}), patchUserAvatar);

module.exports = router;
