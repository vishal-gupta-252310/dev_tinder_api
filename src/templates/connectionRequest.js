const config = require("../config/environment");

const getConnectionRequestTemplate = ({ firstName, requesterName }) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Connection Request</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      .card {
        background-color: #ffffff;
        border-radius: 12px;
        padding: 32px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      .brand {
        font-size: 28px;
        font-weight: 700;
        color: #6366f1;
        text-align: center;
        margin-bottom: 32px;
      }
      h1 {
        font-size: 24px;
        color: #111827;
        margin: 0 0 24px 0;
      }
      .highlight {
        color: #6366f1;
        text-decoration: none;
        font-weight: 600;
      }
      p {
        color: #4b5563;
        margin: 16px 0;
        font-size: 16px;
      }
      .button {
        display: inline-block;
        background-color: #6366f1;
        color: #ffffff !important;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        margin: 24px 0;
      }
      .footer {
        text-align: center;
        color: #6b7280;
        font-size: 14px;
        margin-top: 32px;
      }
      .divider {
        height: 1px;
        background-color: #e5e7eb;
        margin: 24px 0;
      }
      .wave {
        font-size: 24px;
        margin-left: 8px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="brand">DevTinder</div>
        <h1>Hi ${firstName}! <span class="wave">👋</span></h1>
        <p>Great news! You've received a new connection request from <span class="highlight">${requesterName}</span> on DevTinder!</p>
        <p>This could be the start of an amazing collaboration. Don't keep them waiting - check out their profile and respond to their request.</p>
        <div style="text-align: center;">
          <a href="${
            config.webAppUrl
          }/requests" class="button">View Connection Request</a>
        </div>
        <p>Connect, collaborate, and code together - that's what DevTinder is all about!</p>
        <div class="divider"></div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} DevTinder | Connect with developers</p>
          <small>This email was sent to you because you're a member of DevTinder.</small>
        </div>
      </div>
    </div>
  </body>
  </html>`;

  return htmlContent;
};

module.exports = { getConnectionRequestTemplate };
