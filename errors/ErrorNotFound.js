// кастомный класс ошибки 404
const { ERROR_NOT_FOUND } = require('../constants/constants');

class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorNotFound';
    this.statusCode = ERROR_NOT_FOUND;
  }
}

module.exports = ErrorNotFound;
