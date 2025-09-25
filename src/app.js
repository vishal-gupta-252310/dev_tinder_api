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

let whitelist = [
  "https://devconnect.fun",
  "http://devconnect.fun",
  "http://localhost:5173",
];

const corsConfigurations = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsConfigurations));

// routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

// handle unexpected errors (must be last, no path)
app.use(handleGlobalError);

makeConnectionWithDB()
  .then(() => {
    app.listen("7777", "0.0.0.0", () => {
      console.log("Server is listening on port 7777.");
    });
  })
  .catch(() => {
    console.error("something went wrong");
  });
