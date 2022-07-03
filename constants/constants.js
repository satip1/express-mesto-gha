const OK = 200;
const ERROR_DATA = 400;
const ERROR_LOGIN = 401;
const ERROR_DELETE_CARD = 403;
const ERROR_NOT_FOUND = 404;
const ERROR_BAD_EMAIL = 409;
const ERROR_OTHER_ERROR = 500;

const SECRET_CODE = 'aliens';
const HASHSALT = 10;

const REG_LINK = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

module.exports = {
  OK,
  ERROR_DATA,
  ERROR_LOGIN,
  ERROR_DELETE_CARD,
  ERROR_NOT_FOUND,
  ERROR_BAD_EMAIL,
  ERROR_OTHER_ERROR,
  SECRET_CODE,
  HASHSALT,
  REG_LINK,
};
