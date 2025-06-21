const express = require("express");

const app = express();

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }

  next();
});
app.get("/getUserData", (req, res) => {
  try {
    throw new Error();
    res.send("Data fetching successfully");
  } catch (error) {
    res.send("something went wrong please contact developer");
  }
});

app.listen("7777", () => {
  console.log("Server is listening on port 7777.");
});
