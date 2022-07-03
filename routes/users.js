// роутеры для пользователей
const router = require('express').Router();
const {
  getAllUsers, getIdUser, createUser,
  patchUserData, patchUserAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/:userId', getIdUser);
router.get('/users/me', getIdUser);
// router.post('/users', createUser);
router.patch('/users/me', patchUserData);
router.patch('/users/me/avatar', patchUserAvatar);

module.exports = router;
