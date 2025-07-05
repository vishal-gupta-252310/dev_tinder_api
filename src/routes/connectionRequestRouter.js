// third party
const express = require("express");

// middlewares
const { isUserAuth } = require("../middlewares/auth");

// utils
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

// models
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/requests/:toUserId/:status",
  isUserAuth,
  async (req, res, next) => {
    try {
      const toUserId = req.params?.toUserId;
      const status = req.params.status;
      if (!toUserId) throw new AppError(400, "The to user id is required.");

      const validUser = await User.findById(toUserId);
      if (!validUser) {
        throw new AppError(404, "This user not exits.");
      }

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        throw new AppError(400, `Error: ${status} status not allowed here.`);
      }

      const { _id } = req.user;

      const existingConnectionReq = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId: _id,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: _id,
          },
        ],
      });

      if (existingConnectionReq) {
        console.log(existingConnectionReq);
        throw new AppError(400, "Connection request already exists!!.");
      }

      const request = new ConnectionRequest({
        fromUserId: _id,
        toUserId,
        status,
      });

      await request.save();
      sendResponse(res, {
        message:
          status == "interested"
            ? "Connection request successfully sent."
            : "Ignored this user successfully.",
        data: request,
      });
    } catch (error) {
      next(new AppError(400, error.message));
    }
  }
);

module.exports = connectionRequestRouter;
