const USER_SIGNUP_FIELDS = [
  "firstName",
  "lastName",
  "gender",
  "password",
  "email",
  "userName",
];

const USER_EDIT_FIELDS = [
  "firstName",
  "lastName",
  "gender",
  "about",
  "profilePhoto",
  "age",
  "skills",
];

const GENDER_OPTIONS = ["Male", "Female", "Others"];

const USER_SAFE_PUBLIC_DATA =
  "firstName lastName skills profilePhoto gender age about";

module.exports = {
  USER_SIGNUP_FIELDS,
  GENDER_OPTIONS,
  USER_EDIT_FIELDS,
  USER_SAFE_PUBLIC_DATA,
};
