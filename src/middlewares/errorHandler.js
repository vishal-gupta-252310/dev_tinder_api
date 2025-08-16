const handleGlobalError = (err, req, res, next) => {
  // Default values for unexpected errors
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    status,
    message,
    statusCode,
  });
};

module.exports = handleGlobalError;
