// third party
const express = require("express");

// middlewares
const { isUserAuth } = require("../middlewares/auth");

// utils
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

// models
const User = require("../models/user");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/sendConnectionRequest",
  isUserAuth,
  (req, res) => {
    sendResponse(res, {
      message: `${req.user.firstName} send connection request successfully.`,
    });
  }
);

module.exports = connectionRequestRouter;
