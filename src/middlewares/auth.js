const isAdminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send({ status: 401, message: "Unauthorized admin" });
    return;
  }

  next();
};

const isUserAuth = (req, res, next) => {
  const token = "xyz";
  const isUserAuthorized = token === "xyz";
  if (!isUserAuthorized) {
    res.status(401).send({ status: 401, message: "Unauthorized user" });
    return;
  }

  next();
};

module.exports = {
  isAdminAuth,
  isUserAuth,
};
