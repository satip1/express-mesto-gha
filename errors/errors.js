const ERROR_DATA = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_OTHER_ERROR = 500;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = ERROR_DATA;
  }
}

module.exports = {ValidationError}