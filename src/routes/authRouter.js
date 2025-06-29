// third party
const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

// utils
const { validateSignupData } = require("../utils/validation");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

// models
const User = require("../models/user");

const authRouter = express.Router();

// signup new user
authRouter.post("/auth/signup", async (req, res, next) => {
  try {
    // validating data
    validateSignupData(req);

    const { firstName, lastName, password, email, gender, userName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userInstance = new User({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      gender,
      userName,
    });

    const newUser = await userInstance.save();
    sendResponse(res, {
      statusCode: 201,
      message: "User added successfully.",
      data: newUser,
    });
  } catch (err) {
    throw next(new AppError(400, err?.message));
  }
});

authRouter.post("/auth/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!validator.isEmail(email)) {
      throw new AppError(400, "The email address is not valid.");
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      throw new AppError(404, "The email or password is incorrect.");
    }

    const isPasswordValid = await foundUser.isPasswordValid(password);
    if (!isPasswordValid) {
      throw new AppError(404, "The email or password is incorrect.");
    }

    const token = await foundUser.getJwtToken();

    // send cookie
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendResponse(res, {
      message: "Logged in successfully!!!",
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
});

authRouter.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  sendResponse(res, {
    message: "Logout successful",
  });
});

module.exports = authRouter;
