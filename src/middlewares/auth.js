const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isUserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new AppError(400, "Token is not valid!!");
    }

    const decodedMessage = await jwt.verify(token, "Vishal@1234");
    const { id } = decodedMessage;

    const userFound = await User.findById(id);

    if (!userFound) {
      throw new AppError(404, "The user is not found in the system.");
    }

    req.user = userFound;
    next();
  } catch (error) {
    throw new AppError(400, error.message);
  }
};

module.exports = {
  isUserAuth,
};
