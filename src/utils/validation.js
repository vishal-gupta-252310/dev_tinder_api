const { GENDER_OPTIONS } = require("../config/modelHelper");
const AppError = require("./AppError");
const validator = require("validator");

const validateUser = (req) => {
  const {
    firstName,
    lastName,
    password,
    email,
    profilePhoto,
    skills,
    age,
    gender,
    userName,
  } = req.body;

  if (!firstName || !lastName) {
    throw new AppError(400, "The first and last name is required.");
  }

  if (!userName) {
    throw new AppError(400, "The user name is required.");
  }

  if (!validator.isEmail(email)) {
    throw new AppError(400, "The email address is not valid.");
  }

  if (!validator.isStrongPassword(password)) {
    throw new AppError(400, "The password is not strong password.");
  }

  if (!validator.isURL(profilePhoto)) {
    throw new AppError(400, "The Profile Photo url is not valid url.");
  }

  if (skills.length > 10) {
    throw new AppError(400, "The skills adding limit is 10.");
  }

  if (age > 60) {
    throw new AppError(400, "The age limit is 60.");
  }

  if (!GENDER_OPTIONS.includes(gender)) {
    throw new AppError(
      400,
      "The gender should be male, female and others only."
    );
  }
};

module.exports = { validateUser };
