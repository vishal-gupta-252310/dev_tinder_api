const express = require("express");
const app = express();
const makeConnectionWithDB = require("./config/database");
const userModel = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Vikas",
    lastName: "Gupta",
    age: 21,
    gender: "Male",
    userName: "vikasgupta433",
    email: "vikasgupta433@gmail.com",
    password: "Vikas@gupta",
  };

  // creating an instance of user model with user data
  const user = new userModel(userObj);
  try {
    const response = await user.save();
    res
      .status(201)
      .send({ user: response, message: "User added successfully." });
  } catch (err) {
    res.status(400).send("Fail to save user " + err.message);
  }
});

makeConnectionWithDB()
  .then(() => {
    app.listen("7777", () => {
      console.log("Server is listening on port 7777.");
    });
  })
  .catch(() => {
    console.error("something went wrong");
  });
