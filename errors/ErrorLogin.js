// кастомный класс ошибки 401 неверный логин или пароль
const { ERROR_LOGIN } = require('../constants/constants');

class ErrorLogin extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorLogin';
    this.statusCode = ERROR_LOGIN;
  }
}

module.exports = ErrorLogin;
