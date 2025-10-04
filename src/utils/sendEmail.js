const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSimpleSesEmailCommand = ({ toAddress, fromAddress, content }) => {
  console.log("Creating email command with:", {
    toAddress,
    fromAddress,
    content,
  });
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Source: fromAddress,
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: content,
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the message body in text format.",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "This is the subject",
      },
    },
  });
};

const sendEmail = async (props) => {
  const command = createSimpleSesEmailCommand(props);

  try {
    return await sesClient.send(command);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
