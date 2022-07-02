// кастомный класс ошибки 500
// по умолчанию текст ошибки 'На сервере произошла ошибка'
const { ERROR_OTHER_ERROR } = require('../constants/constants');

const textError = 'На сервере произошла ошибка';

class ErrorOtherError extends Error {
  constructor(message = textError) {
    super(message);
    this.name = 'ErrorOtherError';
    this.statusCode = ERROR_OTHER_ERROR;
  }
}

module.exports = ErrorOtherError;
