// third party
const express = require("express");
const cookieParser = require("cookie-parser");

// middlewares
const handleGlobalError = require("./middlewares/errorHandler");

// config
const makeConnectionWithDB = require("./config/database");

// routers
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const connectionRequestRouter = require("./routes/connectionRequestRouter");
const userRouter = require("./routes/userRouter");

// instance
const app = express();

// global middleware used
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

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
