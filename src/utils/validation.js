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

  if (Object.values(req.body).length === 0) {
    Object.values(req.body).forEach((key) => {
      if (!key) {
        validations.push(`${key} is required.`);
      }
    });
  }
  
  if (firstName && (firstName.length < 3 || firstName.length > 50)) {
    validations.push("The first name should be between 3 to 50 characters.");
  }

  if (firstName && !/^[A-Z]+$/i.test(firstName)) {
    validations.push("First name can only contain alphabetic characters.");
  }

  if (lastName && (lastName.length < 3 || lastName.length > 50)) {
    validations.push("The last name should be between 3 to 50 characters.");
  }

  if (lastName && !/^[A-Z]+$/i.test(lastName)) {
    validations.push("Last name can only contain alphabetic characters.");
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
    throw new AppError(400, "Validation failed", validations);
  }
};

/**
 * To check allowed fields
 * @param {object} req
 * @returns bool
 */
const isAllowedEditFields = (req) => {
  if (!req.body) {
    return false;
  }

  // check allowed fields
  const isAllowed = Object.keys(req.body).every((field) =>
    USER_EDIT_FIELDS.includes(field)
  );

  return isAllowed;
};

const validatePasswordChangeData = (req) => {
  if (!req.body || !req.body?.oldPassword || !req.body?.newPassword) {
    throw new AppError(400, "The old and new password is required.");
  }

  const { newPassword } = req.body;

  if (newPassword.length < 8 || newPassword.length > 50) {
    throw new AppError(
      400,
      "The new password should be between 8 to 50 characters."
    );
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new AppError(400, "The new password is not strong password.");
  }
};

const validateUserName = (req) => {
  if (!req.body || !req.body?.userName) {
    throw new AppError(400, "The user name is required.");
  }
  const { userName } = req.body;

  if (userName.length < 3 || userName.length > 50) {
    throw new AppError(
      400,
      "The user name should be between 3 to 50 characters."
    );
  }

  if (!/^[a-z0-9]+$/i.test(userName)) {
    throw new AppError(400, "The user name is not in proper format.");
  }
};

module.exports = {
  validateSignupData,
  validateEditFields,
  validatePasswordChangeData,
  validateUserName,
};
