const handleGlobalError = (err, req, res, next) => {
  if (err) {
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};

module.exports = handleGlobalError;
