const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("This is test route.");
});

app.post("/user", (req, res) => {
  res.send({ status: 201, message: "User added successfully." });
});

app.get("/user", (req, res) => {
  res.send({ firstName: "Vishal", lastName: "Gupta" });
});

app.put("/user/:id", (req, res) => {
  res.send({ status: 200, message: "User updated successfully." });
});

app.patch("/user/:id", (req, res) => {
  res.send({ status: 200, message: "User updated successfully." });
});

app.delete("/user/:id", (req, res) => {
  res.send({ status: 200, message: "User Deleted successfully." });
});

app.listen("7777", () => {
  console.log("Server is listening on port 7777.");
});
