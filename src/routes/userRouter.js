const express = require("express");
const { isUserAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const sendResponse = require("../utils/sendResponse");
const AppError = require("../utils/AppError");
const User = require("../models/user");
const { USER_SAFE_PUBLIC_DATA } = require("../config/modelHelper");

const userRouter = express.Router();

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
      .populate("toUserId", USER_SAFE_PUBLIC_DATA)
      .lean({ virtuals: true });

    const filteredUsers = connections.map((row) => {
      if (row?.fromUserId._id.equals(loggedUser?._id)) {
        row.toUserId.connectionId = row.connectionId;
        return row.toUserId;
      }

      row.fromUserId.connectionId = row.connectionId;
      return row.fromUserId;
    });

    res.json({
      status: "success",
      message: "Connections are fetched successfully.",
      statusCode: 200,
      data: filteredUsers ?? [],
    });
  } catch (error) {
    throw new AppError(400, "Something went wrong.");
  }
});

// to get the feed list of logged user
userRouter.get("/users/me/feed", isUserAuth, async (req, res, next) => {
  // to get logged user
  // get the user listing where
  // connected user not come
  // ignored, interested or rejected user should not come
  // self data should also not come

  // first get users whom the logged user sent request or get request from them and check status also
  // to get users ids from the hideUsersList and unique also
  // get all users after excluding the hideUsersFeed user ids and self
  try {
    const loggedUser = req.user;
    const pageNumber = parseInt(req.query?.page) || 1;
    let limit = parseInt(req.query?.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    if ((pageNumber && pageNumber < 1) || (limit && limit < 1)) {
      throw new AppError(400, "Please give valid values for page and limit");
    }

    const skip = (pageNumber - 1) * limit;
    const requests = await ConnectionRequest.find({
      $and: [
        { status: { $in: ["interested", "ignored", "accepted", "rejected"] } },
        { $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }] },
      ],
    });

    const hideUsersFeed = new Set();

    requests.forEach((item) => {
      hideUsersFeed.add(item.fromUserId.toString());
      hideUsersFeed.add(item.toUserId.toString());
    });

    const loggedUserFeedList = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFeed) } },
        { _id: { $ne: loggedUser._id } },
      ],
    })
      .select(USER_SAFE_PUBLIC_DATA)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true });

    res.json({
      status: "success",
      data: loggedUserFeedList,
      message: "Feed fetched successfully.",
    });
  } catch (error) {
    throw next(new AppError(400, error.message));
  }
});

module.exports = userRouter;
