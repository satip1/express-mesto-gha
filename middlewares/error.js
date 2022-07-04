// общий обработчик ошибок в catch
const { ERROR_OTHER_ERROR } = require('../constants/constants');

module.exports.error = (err, req, res, next) => {
  const { name, statusCode = ERROR_OTHER_ERROR, message = 'Какая-то ошибка сервера' } = err;
  res
    .status(statusCode)
    .send({
      message: `${name} Код ошибки ${statusCode}: ${message}`,
    });

  return next();
};
