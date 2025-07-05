const express = require("express");
const { isUserAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const sendResponse = require("../utils/sendResponse");
const AppError = require("../utils/AppError");

const userRouter = express.Router();
const USER_SAFE_PUBLIC_DATA =
  "firstName lastName skills profilePhoto gender age about";

// To get all pending connection requests for logged in user
userRouter.get("/users/me/requests", isUserAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const requests = await ConnectionRequest.find({
      toUserId: loggedUser?._id,
      status: "interested",
      // }).populate("fromUserId", [
      //   "firstName",
      //   "lastName",
      //   "age",
      //   "gender",
      //   "profilePhoto",
      //   "skills",
      //   "bio",
      // ]);
    }).populate("fromUserId", USER_SAFE_PUBLIC_DATA);

    res.json({
      message: "Requests fetched successfully.",
      status: "success",
      data: requests ?? [],
    });
  } catch (error) {
    throw new AppError(400, error.message);
  }
});

// to get all accepted connections requests for logged in user
userRouter.get("/users/me/connections", isUserAuth, async (req, res) => {
  // get the logged in user
  // get the connections request which are
  // accepted
  // and logged user id present either from User id or to User id
  // get requests
  // send response
  try {
    const loggedUser = req.user;

    const connections = await ConnectionRequest.find({
      $and: [
        { status: "accepted" },
        {
          $or: [{ fromUserId: loggedUser?._id }, { toUserId: loggedUser?._id }],
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_PUBLIC_DATA)
      .populate("toUserId", USER_SAFE_PUBLIC_DATA);
    const filteredUsers = connections.map((row) => {
      if (row?.fromUserId._id.equals(loggedUser?._id)) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({
      status: "success",
      message: "Connections are fetched successfully.",
      data: filteredUsers ?? [],
    });
  } catch (error) {
    throw new AppError(400, "Something went wrong.");
  }
});

module.exports = userRouter;
