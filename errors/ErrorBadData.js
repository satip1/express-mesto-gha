// кастомный класс ошибки 400
const { ERROR_DATA } = require('../constants/constants');

class ErrorBadData extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorBadData';
    this.statusCode = ERROR_DATA;
  }
}

module.exports = ErrorBadData;
