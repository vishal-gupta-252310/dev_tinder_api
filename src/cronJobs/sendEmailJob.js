const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");

const { DateTime } = require("luxon");
const { USER_SAFE_PUBLIC_DATA } = require("../config/modelHelper");
const { sendEmail } = require("../utils/sendEmail");
const {
  getConnectionRequestTemplate,
} = require("../templates/connectionRequest");

/**
 * To process email sending
 * @param {object} param0
 */
const processEmailSend = async ({
  toAddress,
  fromAddress,
  content,
  Subject,
}) => {
  try {
    await sendEmail({
      toAddress,
      fromAddress,
      isHtmlContent: true,
      Subject,
      content,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * To send email with retry mechanism
 * @param {object} emailData
 * @param {number} MAX_ATTEMPTS
 * @returns {boolean} true if email sent successfully else false
 */
const sendEmailWithRetry = async (emailData, MAX_ATTEMPTS = 5) => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await processEmailSend(emailData);
      return true;
    } catch (error) {
      console.error(`Attempt ${attempt} to send email failed:`, error);
      if (attempt === MAX_ATTEMPTS) {
        console.error("MAX ATTEMPTS reached. Email not sent.", emailData);
        return false;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds before retrying
    }
  }
};

// this cron job will run every day at 8 AM
cron.schedule("* 8 * * *", async () => {
  console.log("running a task every day at 8 AM", new Date());
  try {
    // send email to users which got connection requests yesterday
    const users = await ConnectionRequest.find({
      createdAt: {
        $gt: DateTime.now().minus({ days: 1 }),
        $lt: DateTime.now(),
      },
      status: "interested",
    })
      .populate("toUserId", `${USER_SAFE_PUBLIC_DATA} email`)
      .populate("fromUserId", `${USER_SAFE_PUBLIC_DATA} email fullName`);

    for (let user of users) {
      const toUser = user.toUserId;
      const fromUser = user.fromUserId;

      if (toUser && fromUser) {
        try {
          await sendEmailWithRetry({
            toAddress: toUser.email,
            fromAddress: process.env.FROM_EMAIL_ADDRESS,
            content: getConnectionRequestTemplate({
              firstName: toUser.firstName,
              requesterName: fromUser.fullName,
            }),
            isHtmlContent: true,
            Subject: `New connection request received from ${fromUser.fullName}`,
          });
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching connection requests:", error);
  }
});
