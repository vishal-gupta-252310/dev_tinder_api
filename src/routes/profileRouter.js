// third party
const express = require("express");
const bcrypt = require("bcrypt");

// middlewares
const { isUserAuth } = require("../middlewares/auth");

// utils
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

// validations
const {
  validateEditFields,
  validatePasswordChangeData,
  validateUserName,
} = require("../utils/validation");

// models
const User = require("../models/user");
const { generateHashData } = require("../utils/common");

const profileRouter = express.Router();

profileRouter.get("/profile", isUserAuth, async (req, res) => {
  sendResponse(res, {
    message: "User profile data fetched successfully!!",
    data: req.user,
  });
});

profileRouter.patch("/profile", isUserAuth, async (req, res) => {
  try {
    validateEditFields(req);

    const user = req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    sendResponse(res, {
      message: `${user.firstName}, your profile update successfully.`,
      data: user,
    });
  } catch ({ message = "", validations = [] }) {
    res.send({
      status: "fail",
      message,
      validations,
    });
  }
});

profileRouter.put("/profile/password", isUserAuth, async (req, res) => {
  try {
    validatePasswordChangeData(req);
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, "The old password is incorrect.");
    }

    const hashedNewPassword = await generateHashData(newPassword.trim());
    user.password = hashedNewPassword;
    await user.save();
    sendResponse(res, {
      message: `${user.firstName}, your password updated successfully.`,
    });
  } catch (error) {
    throw new AppError(400, error.message);
  }
});

profileRouter.put("/profile/username", isUserAuth, async (req, res, next) => {
  try {
    validateUserName(req);
    const { userName } = req.body;
    const user = await User.findOne({ userName });

    if (user) {
      throw new AppError(409, "User already exist with this username.");
    }

    const loggedUser = req.user;
    loggedUser.userName = userName;
    await loggedUser.save();
    sendResponse(res, {
      message: `${loggedUser?.firstName}, your user name updated successfully.`,
    });
  } catch (error) {
    console.log(error);
    throw new AppError(error?.statusCode ?? 400, error.message);
  }
});

module.exports = profileRouter;
