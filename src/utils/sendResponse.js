const sendResponse = (
  res,
  { status = "success", statusCode = 200, message, data = null }
) => {
  const resData = {
    message,
    status,
  };

  if (data && Object.keys(data).length > 0) {
    resData.data = data;
  }
  res.status(statusCode).send({ ...resData });
};

module.exports = sendResponse;
