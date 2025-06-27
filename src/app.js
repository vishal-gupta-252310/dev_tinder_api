const express = require("express");
const app = express();
const makeConnectionWithDB = require("./config/database");
const userModel = require("./models/user");
const AppError = require("./utils/AppError");
const handleGlobalError = require("./middlewares/errorHandler");
const sendResponse = require("./utils/sendResponse");
const { toCheckAllowedFields } = require("./utils/common");
const { userSignupFields } = require("./config/modelHelper");
const { USER_ERROR_MESSAGES } = require("./config/errorMessage");

app.use(express.json());

// signup new user
app.post("/signup", async (req, res, next) => {
  const userData = req.body;

  try {
    const user = new userModel(userData);
    const isAllowed = toCheckAllowedFields(userSignupFields, userData);

    if (!isAllowed) {
      throw new AppError(
        400,
        "Some data is not allowed according to our schema"
      );
    }

    const newUser = await user.save();
    sendResponse(res, {
      statusCode: 201,
      message: "User added successfully.",
      data: newUser,
    });
  } catch (err) {
    throw next(new AppError(400, err?.message));
  }
});

// to get a user by email
app.get("/user", async (req, res) => {
  const email = req.query?.email;

  if (!email) throw new Error();

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(404).send({ status: 404, message: "User not found" });
    } else {
      res.status(200).send({ user, message: "User fetched successfully" });
    }
  } catch (error) {
    res.status(400).send("Fail to get user by email");
  }
});

// get all users listing
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await userModel.find({});

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

// to get the user by id
app.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);

    if (!user) throw new AppError(404, "User not found");
    sendResponse(res, {
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).send("Failed to send the user");
  }
});

// to delete the user by id
app.delete("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;

  if (!userId) throw new Error();

  try {
    await userModel.findByIdAndDelete(userId);

    res.status(200).send({ status: 200, message: "User deleted successfully" });
  } catch (error) {
    res.status(400).send({ status: 400, message: "failed to delete user" });
  }
});

// to update the user
app.patch("/user/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  const updateFields = req.body;

  if (!updateFields) throw new AppError(400, USER_ERROR_MESSAGES.NO_PAYLOAD);

  try {
    const isAllowed = toCheckAllowedFields(
      userSignupFields.filter((item) => item != "email"),
      updateFields
    );

    if (!isAllowed) {
      throw next(new AppError(400, USER_ERROR_MESSAGES.ALLOWED_FIELD));
    }

    const user = await userModel.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!user)
      throw next(new AppError(400, USER_ERROR_MESSAGES.USER_NOT_FOUND));
    sendResponse(res, {
      data: user,
      message: USER_ERROR_MESSAGES.USER_UPDATED,
    });
  } catch (error) {
    throw new AppError(
      400,
      error.message ?? USER_ERROR_MESSAGES.USER_UPDATE_FAIL
    );
  }
});

// update user by email
app.put("/user/:email", async (req, res, next) => {
  const updateFields = req.body;
  const email = req.params.email;

  if (!updateFields || !email) {
    throw new AppError(400, USER_ERROR_MESSAGES.NO_PAYLOAD);
  }

  try {
    const isAllowed = toCheckAllowedFields(
      userSignupFields.filter((item) => item != "email"),
      updateFields
    );

    if (!isAllowed) {
      throw new AppError(400, USER_ERROR_MESSAGES.ALLOWED_FIELD);
    }

    const user = await userModel.findOneAndUpdate({ email }, updateFields, {
      returnDocument: "after",
    });

    if (!user)
      throw next(new AppError(404, USER_ERROR_MESSAGES.USER_NOT_FOUND));
    sendResponse(res, {
      data: user,
      message: USER_ERROR_MESSAGES.USER_UPDATED,
    });
  } catch (error) {
    throw new AppError(400, USER_ERROR_MESSAGES.USER_UPDATE_FAIL);
  }
});

// handle unexpected errors
app.use("/", handleGlobalError);

makeConnectionWithDB()
  .then(() => {
    app.listen("7777", () => {
      console.log("Server is listening on port 7777.");
    });
  })
  .catch(() => {
    console.error("something went wrong");
  });
