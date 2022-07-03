// кастомный класс ошибки 409 емейл уже существует
// ошибку формирует монгуст с кодом 11000

const { ERROR_BAD_EMAIL } = require('../constants/constants');

class ErrorBadEmail extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorBadEmail';
    this.statusCode = ERROR_BAD_EMAIL;
  }
}

module.exports = ErrorBadEmail;
