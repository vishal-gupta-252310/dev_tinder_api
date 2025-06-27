const mongoose = require("mongoose");
const validator = require("validator");
const { GENDER_OPTIONS } = require("../config/modelHelper");

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
    },
    gender: {
      type: String,
      required: true,
      enum: GENDER_OPTIONS,
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
      default: ["JS", "TS", "NodeJS"],
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
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
