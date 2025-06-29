// third party
const express = require("express");

// middlewares
const { isUserAuth } = require("../middlewares/auth");

// utils
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

// validations
const { validateEditFields } = require("../utils/validation");

// models
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile", isUserAuth, async (req, res) => {
  sendResponse(res, {
    message: "User profile data fetched successfully!!",
    data: req.user,
  });
});

profileRouter.patch("/profile", isUserAuth, (req, res) => {
  try {
    validateEditFields(req);

    const user = req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    user.save();
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

module.exports = profileRouter;
