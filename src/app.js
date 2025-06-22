const express = require("express");
const app = express();
const makeConnectionWithDB = require("./config/database");
const userModel = require("./models/user");

app.use(express.json());

// signup new user
app.post("/signup", async (req, res) => {
  const userData = req.body;

  // creating an instance of user model with user data
  const user = new userModel(userData);
  try {
    const response = await user.save();
    res
      .status(201)
      .send({ user: response, message: "User added successfully." });
  } catch (err) {
    res.status(400).send("Fail to save user " + err.message);
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

  if (!userId) throw new Error();

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      res.status(404).send({ status: 404, message: "User not found" });
    } else {
      res
        .status(200)
        .send({ user, message: "User fetched successfully", status: 200 });
    }
  } catch (error) {
    res.status(400).send("Failed to send the user");
  }
});

// to delete the user by id
app.delete("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) throw new Error();

  try {
    await userModel.findByIdAndDelete(userId);

    res.status(200).send({ status: 200, message: "User deleted successfully" });
  } catch (error) {
    res.status(400).send({ status: 400, message: "failed to delete user" });
  }
});

// to update the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updateFields = req.body;

  if (!updateFields) throw new Error();

  try {
    const user = await userModel.findByIdAndUpdate(
      { _id: userId },
      updateFields,
      { returnDocument: "after" }
    );

    if (!user) {
      res.status(404).send({ status: 404, message: "User not found" });
    } else {
      res.send({ user, status: 200, message: "User updated successfully" });
    }
  } catch (error) {
    res.status(400).send({ status: 400, message: "Failed to update the user" });
  }
});

// update user by email
app.put("/user/:email", async (req, res) => {
  const updateFields = req.body;
  const email = req.params.email;

  if (!updateFields || !email) throw new Error();

  try {
    const user = await userModel.findOneAndUpdate({ email }, updateFields, {
      returnDocument: "after",
    });
    console.log(user);

    if (!user) {
      res.status(404).send({ status: 404, message: "User not found" });
    } else {
      res.send({ user, status: 200, message: "User updated successfully" });
    }
  } catch (error) {
    es.status(400).send({ status: 400, message: "Failed to update the user" });
  }
});

// handle unexpected errors
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
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
