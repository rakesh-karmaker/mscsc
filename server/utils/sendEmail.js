const nodemailer = require("nodemailer");
const otpDraft = require("./otpDraft");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Test the transporter
transporter.verify((error, success) => {
  if (error) {
    console.log(error, "email");
  } else {
    console.log("Server is ready to take our messages");
  }
});

const sendEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_ADDRESS,
      to: email,
      subject: "Password Reset OTP",
      html: otpDraft(otp),
    });
    return;
  } catch (err) {
    console.log("Error sending email - ", new Date(), "\n---\n", err);
  }
};

module.exports = sendEmail;
