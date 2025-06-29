const { GENDER_OPTIONS, USER_EDIT_FIELDS } = require("../config/modelHelper");
const { USER_ERROR_MESSAGES } = require("../config/errorMessage");
const AppError = require("./AppError");
const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, password, email, gender, userName } = req.body;

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

  if (!GENDER_OPTIONS.includes(gender)) {
    throw new AppError(
      400,
      "The gender should be male, female and others only."
    );
  }
};

/**
 * To validate edit fields
 * @param {object} req
 */
const validateEditFields = (req) => {
  if (!isAllowedEditFields(req)) {
    throw new AppError(400, USER_ERROR_MESSAGES.ALLOWED_FIELD);
  }

  const { firstName, lastName, age, gender, about, skills, profilePhoto } =
    req.body;
  let validations = [];

  if (firstName && (firstName.length < 3 || firstName.length > 50)) {
    validations.push("The first name should be between 3 to 50 characters.");
  }

  if (lastName && (lastName.length < 3 || lastName.length > 50)) {
    validations.push("The last name should be between 3 to 50 characters.");
  }

  if (age && age < 18) {
    validations.push("The age should be equal to greater then 18.");
  }

  if (gender && !GENDER_OPTIONS.includes(gender)) {
    validations.push("The gender should be male, female and others.");
  }

  if (about && (about.length < 20 || about.length > 500)) {
    validations.push("The about should be between 20 to 500 characters.");
  }

  if (skills && skills.length > 10) {
    validations.push("The skills should be equal or less then 10.");
  }

  if (profilePhoto && !validator.isURL(profilePhoto)) {
    validations.push("The profile photo should be valid url.");
  }

  if (validations.length > 0) {
    throw new AppError(400, "validations is failed", validations);
  }
};

/**
 * To check allowed fields
 * @param {object} req
 * @returns bool
 */
const isAllowedEditFields = (req) => {
  if (!req.body) {
    throw new AppError(400, USER_ERROR_MESSAGES.NO_PAYLOAD);
  }

  // check allowed fields
  const isAllowed = Object.keys(req.body).every((field) =>
    USER_EDIT_FIELDS.includes(field)
  );

  return isAllowed;
};

module.exports = { validateSignupData, validateEditFields };
