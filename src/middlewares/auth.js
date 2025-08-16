const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isUserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(new AppError(401, "Token is missing. Please login again."));
    }

    const decodedMessage = await jwt.verify(token, "Vishal@1234");
    const { id } = decodedMessage;

    const userFound = await User.findById(decodedMessage.id);
    if (!userFound) {
      return next(new AppError(404, "User not found in the system."));
    }

    req.user = userFound;
    next();
  } catch (error) {
    next(new AppError(500, "Internal Server Error: " + error.message));
  }
};

module.exports = {
  isUserAuth,
};
