const dotenv = require("dotenv");

// third party
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// env variables
dotenv.config({ path: "./.env" });

// cron jobs
require("./cronJobs/sendEmailJob");

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

app.use(cookieParser());
app.use(express.json());

let whitelist = [
  "https://devconnect.fun",
  "https://www.devconnect.fun",
  "http://devconnect.fun",
  "http://localhost:5173",
];

const corsConfigurations = {
  origin: function (origin, callback) {
    console.log("CORS checking origin:", origin);
    // allow requests with no origin (like curl or server-to-server)
    if (!origin) {
      console.log("No origin, allowing request");
      return callback(null, true);
    }

    // check if origin starts with any of the whitelisted domains
    const isAllowed = whitelist.some((domain) => origin.startsWith(domain));
    console.log("Origin allowed?", isAllowed);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("CORS error: origin not allowed");
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsConfigurations));

// logging middleware
app.use((req, _, next) => {
  console.log("Request received:", req.path, req.method);
  next();
});

// routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

// handle unexpected errors (must be last, no path)
app.use(handleGlobalError);

let server = null;

makeConnectionWithDB()
  .then(() => {
    server = app.listen(process.env.PORT ?? 7777, process.env.HOST, () => {
      console.log("Server is listening on port " + (process.env.PORT || 7777));
    });
  })
  .catch(() => {
    console.log("Failed to connect with DB, server not started.");
  });

/**
 * Closes the server and exits the process
 */
const closeServer = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  }
};

process.on("SIGINT", () => {
  closeServer();
});

process.on("SIGTERM", () => {
  closeServer();
});

process.on("SIGTSTP", () => {
  closeServer();
});
