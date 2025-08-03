// third party
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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

const corsConfigurations = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsConfigurations));

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
