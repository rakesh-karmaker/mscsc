const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "smtp-mail.outlook.com",
  auth: {
    user: process.env.HOTMAIL_ADDRESS,
    pass: process.env.HOTMAIL_PASS,
  },
});

// test
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const sendEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: process.env.HOTMAIL_ADDRESS,
      to: email,
      subject: "Your password has been reset",
      html: "<h1>Click here to reset your password</h1>",
    });
  } catch (err) {
    console.log("Error sending email - ", getDate(), "\n---\n", err);
    throw err;
  }
};

module.exports = sendEmail;
