const mongoose = require("mongoose");
const config = require("./environment");

const mongodbUri = config.mongoDbUri;

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
