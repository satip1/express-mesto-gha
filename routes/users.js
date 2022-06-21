// роутеры для пользователей
const router = require('express').Router();
const {
  getAllUsers, getIdUser, creatUser,
  patchUserData, patchUserAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/:userId', getIdUser);
router.post('/users', creatUser);
router.patch('/users/me', patchUserData);
router.patch('/users/me/avatar', patchUserAvatar);

module.exports = router;
