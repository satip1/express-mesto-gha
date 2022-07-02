// кастомный класс ошибки 403 удаления чужой карточки
const { ERROR_DELETE_CARD } = require('../constants/constants');

class ErrorDeleteCard extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorNotFound';
    this.statusCode = ERROR_DELETE_CARD;
  }
}

module.exports = ErrorDeleteCard;
