class AppError extends Error {
  constructor(statusCode, message, validations) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.validations = [];

    if (validations) {
      this.validations = validations;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
