const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("./AppError");
const config = require("../config/environment");

/**
 * common function to generate jwt token
 * @param {object} tokenSecretData
 * @returns
 */
const generateJwtToken = async (tokenSecretData) => {
  const token = await jwt.sign(tokenSecretData, config.jwtSecret, {
    expiresIn: config.jwtExpiryTime,
  });

  if (!token) {
    throw new AppError(500, "Internal server error");
  }

  return token;
};

/**
 * To generate hash data
 * @param {string} data
 * @param {number} saltRound
 */
const generateHashData = async (
  data = "",
  saltRound = config.hashSaltRounds
) => {
  if (!data) throw new AppError(400, "Please provide hashing data.");

  const hashData = await bcrypt.hash(data, saltRound);

  if (!hashData) {
    throw new AppError(500, "Internal server error");
  }
  return hashData;
};

module.exports = { generateJwtToken, generateHashData };
