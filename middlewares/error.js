// общий обработчик ошибок в catch

module.exports.error = (err, req, res, next) => {
  const { name, statusCode, message } = err;
  res
    .status(statusCode)
    .send({
      message: `${name}  Код ошибки ${statusCode}: ${message}`,
    });

  next();
};
