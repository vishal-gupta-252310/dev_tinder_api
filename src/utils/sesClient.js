const { SESClient } = require("@aws-sdk/client-ses");

const REGION = process.env.AWS_REGION || "eu-north-1";

const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_KEY,
    secretAccessKey: process.env.AWS_SECRET_SES_ACCESS_KEY,
  },
});

module.exports = { sesClient };
