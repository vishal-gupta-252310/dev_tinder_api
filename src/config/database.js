const mongoose = require("mongoose");

const mongodbUri =
  "mongodb+srv://vishalgupta252310:vishalgupta252310@cluster0.nedg5.mongodb.net/devTinder";

const makeConnectionWithDB = async (err, req, res) => {
  if (err) {
    console.log("something went wrong while connecting to db");
    return;
  }

  try {
    await mongoose.connect(mongodbUri);
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection fails.");
  }
};

module.exports = makeConnectionWithDB;
