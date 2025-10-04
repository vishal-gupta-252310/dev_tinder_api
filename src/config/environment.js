const config = {
  env: process.env.NODE_ENV ?? "local",
  port: process.env.PORT ?? 7777,
  mongoDbUri: process.env.MONGO_DB_URI,
  awsSesKey: process.env.AWS_SES_KEY,
  awsSecretSesAccessKey: process.env.AWS_SECRET_SES_ACCESS_KEY,
  jwtSecret: process.env.JWT_SIGN_SECRET_KEY,
  jwtExpiryTime: process.env.JWT_EXPIRY_TIME,
  hashSaltRounds: 10,
  webAppUrl: process.env.WEB_APP_URL || "http://localhost:5173",
};

module.exports = config;
