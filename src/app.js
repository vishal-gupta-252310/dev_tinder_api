const express = require("express");
const { isAdminAuth, isUserAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", isAdminAuth);

app.post("/user/login", (req, res) => {
  res.send({ status: 200, message: "Logged in successfully" });
});

app.get("/admin/company", (req, res) => {
  res.send({ status: 200, message: "Listing of companies" });
});

app.get("/admin/company/users", (req, res) => {
  res.send({ status: 200, message: "Listing of users" });
});

app.get("/user", isUserAuth, (req, res) => {
  res.send({ status: 200, message: "User profile data fetched successfully" });
});

app.listen("7777", () => {
  console.log("Server is listening on port 7777.");
});
