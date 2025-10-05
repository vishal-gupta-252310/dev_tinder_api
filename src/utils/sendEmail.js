const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSimpleSesEmailCommand = ({
  toAddress,
  fromAddress,
  content,
  isHtmlContent,
  isTextContent,
  Subject = "This is the subject",
}) => {
  let params = {
    Destination: {
      ToAddresses: [toAddress],
    },
    Source: fromAddress,
    Message: {
      Body: {},
      Subject: {
        Charset: "UTF-8",
        Data: Subject,
      },
    },
  };

  if (isHtmlContent) {
    params.Message.Body = {
      Html: {
        Charset: "UTF-8",
        Data: content,
      },
    };
  }

  if (isTextContent && !isHtmlContent) {
    params.Message.Body = {
      Text: {
        Charset: "UTF-8",
        Data: content,
      },
    };
  }
  return new SendEmailCommand(params);
};

/**
 * To send email using AWS SES
 * @param {object} props
 */
const sendEmail = async ({
  toAddress,
  fromAddress,
  content,
  isHtmlContent,
  isTextContent = true,
  Subject = "This is the subject",
}) => {
  const command = createSimpleSesEmailCommand({
    toAddress,
    fromAddress,
    content,
    isHtmlContent,
    isTextContent,
    Subject,
  });

  try {
    const response = await sesClient.send(command);
    console.log("Email sent successfully", response.MessageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
