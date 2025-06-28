// third party
const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");

// middlewares
const handleGlobalError = require("./middlewares/errorHandler");
const { isUserAuth } = require("./middlewares/auth");

// utils
const AppError = require("./utils/AppError");
const sendResponse = require("./utils/sendResponse");
const { toCheckAllowedFields } = require("./utils/common");
const { validateUser } = require("./utils/validation");

// config
const makeConnectionWithDB = require("./config/database");
const { userSignupFields } = require("./config/modelHelper");
const { USER_ERROR_MESSAGES } = require("./config/errorMessage");

// models
const User = require("./models/user");

// instance
const app = express();

// global middleware used
app.use(express.json());
app.use(cookieParser());

// signup new user
app.post("/signup", async (req, res, next) => {
  try {
    // validating data
    validateUser(req);

    const {
      firstName,
      lastName,
      password,
      email,
      profilePhoto,
      skills,
      age,
      gender,
      userName,
      about,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userInstance = new User({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      profilePhoto,
      skills,
      age,
      gender,
      userName,
      about: about ?? "",
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

app.post("/login", async (req, res, next) => {
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

// to get a user by email
app.get("/user", async (req, res) => {
  const email = req.query?.email;

  if (!email) throw new Error();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).send({ status: 404, message: "User not found" });
    } else {
      res.status(200).send({ user, message: "User fetched successfully" });
    }
  } catch (error) {
    res.status(400).send("Fail to get user by email");
  }
});

app.get("/profile", isUserAuth, async (req, res) => {
  sendResponse(res, {
    message: "User profile data fetched successfully!!",
    data: req.user,
  });
});

// get all users listing
app.get("/feed", isUserAuth, async (req, res) => {
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

// to get the user by id
app.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) throw new AppError(404, "User not found");
    sendResponse(res, {
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).send("Failed to send the user");
  }
});

app.post("/sendConnectionRequest", isUserAuth, (req, res) => {
  sendResponse(res, {
    message: `${req.user.firstName} send connection request successfully.`,
  });
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
