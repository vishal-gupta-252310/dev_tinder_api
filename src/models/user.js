const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { GENDER_OPTIONS } = require("../config/modelHelper");
const AppError = require("../utils/AppError");
const { generateJwtToken } = require("../utils/common");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
      match: /^[A-Z]+$/i,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
      match: /^[A-Z]+$/i,
    },
    age: {
      type: Number,
      trim: true,
      default: 18,
      min: 18,
      max: 60,
      default: 18,
    },
    gender: {
      type: String,
      // created an index on gender field
      index: true,
      enum: GENDER_OPTIONS,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      maxLength: 80,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong password.");
        }
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email address is not valid.");
        }
      },
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLength: 5,
      maxLength: 50,
      match: /^[a-z0-9]+$/i,
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          if (arr.length > 10) {
            throw new Error("You can select up to 10 skills only.");
          }
        },
      },
    },
    profilePhoto: {
      type: String,
      trim: true,
      default: function () {
        switch (this.gender) {
          case "Male":
            return "https://example.com/default-male.png";
          case "Female":
            return "https://example.com/default-female.png";
          default:
            return "https://example.com/default.png";
        }
      },
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Profile photo is not valid url.");
        }
      },
    },
    about: {
      type: String,
      trim: true,
      minLength: 20,
      maxLength: 500,
      default: "I am Professional developer using dev tinder",
    },
  },
  { timestamps: true }
);

/**
 * User schema method to generate jwt token
 * @returns string
 */
userSchema.methods.getJwtToken = async function () {
  const user = this;
  const token = await generateJwtToken({ id: user?._id });
  return token;
};

/**
 * To check password is valid or not
 * @param {string} userInputPassword
 * @returns bool
 */
userSchema.methods.isPasswordValid = async function (userInputPassword) {
  const hashedPassword = this.password;
  const isPasswordValid = await bcrypt.compare(
    userInputPassword,
    hashedPassword
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
