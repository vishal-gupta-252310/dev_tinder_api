const config = {
  env: process.env.NODE_ENV ?? "local",
  port: process.env.PORT ?? 7777,
  mongoDbUri: process.env.MONGO_DB_URI,
  awsSesKey: process.env.AWS_SES_KEY,
  awsSecretSesAccessKey: process.env.AWS_SECRET_SES_ACCESS_KEY,
};

module.exports = config;
