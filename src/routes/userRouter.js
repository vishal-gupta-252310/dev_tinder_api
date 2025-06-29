// third party
const express = require("express");

// middlewares
const { isUserAuth } = require("../middlewares/auth");

// utils
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

// models
const User = require("../models/user");

const userRouter = express.Router();

// get all users listing
userRouter.get("/feed", isUserAuth, async (req, res) => {
  try {
    const allUsers = await User.find({});

    if (allUsers.length === 0) {
      res.status(400).send("There are no records");
    } else {
      res
        .status(200)
        .send({ users: allUsers, message: "Users fetched successfully" });
    }
  } catch (error) {
    res.status(400).send("Failed to send the user listing " + error.message);
  }
});

module.exports = userRouter;
