// мидлверы для авторизации и защиты роутов

const jwt = require('jsonwebtoken');

const ErrorLogin = require('../errors/ErrorLogin');
const ErrorNotFound = require('../errors/ErrorNotFound');
const { SECRET_CODE } = require('../constants/constants');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  // если авторизации нет или не содержит Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ErrorNotFound('Необходима авторизация ккк'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_CODE);
  } catch (err) {
    return next(new ErrorLogin('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
