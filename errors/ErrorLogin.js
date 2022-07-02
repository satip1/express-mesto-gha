// кастомный класс ошибки 401 неверный логин или пароль
const { ERROR_LOGIN } = require('../constants/constants');

const textError = 'На сервере произошла ошибка';

class ErrorLogin extends Error {
  constructor(message = textError) {
    super(message);
    this.name = 'ErrorNotFound';
    this.statusCode = ERROR_LOGIN;
  }
}

module.exports = ErrorLogin;
