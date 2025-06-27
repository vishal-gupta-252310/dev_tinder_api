const sendResponse = (
  res,
  { status = "success", statusCode = 200, message, data = null }
) => {
  res.status(statusCode).send({
    data,
    message,
    status,
  });
};

module.exports = sendResponse;
