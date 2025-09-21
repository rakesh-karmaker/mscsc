import config from "./config.js";
import nodemailer from "nodemailer";

console.log(
  "Mail Address:",
  config.mailAddress ? `Loaded ${config.mailAddress}` : "Not Loaded"
);
const mailSender = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ADDRESS || config.mailAddress, // Use environment variable if available
    pass: process.env.MAIL_PASS || config.mailPass, // Use environment variable if available
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
  // Add connection timeout and retry settings for Render compatibility
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
});

// Add connection verification with retry
const verifyConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((resolve, reject) => {
        mailSender.verify((error, success) => {
          if (error) {
            reject(error);
          } else {
            resolve(success);
          }
        });
      });
      console.log("Server is ready to send our emails");
      return true;
    } catch (error: any) {
      console.log(`Email verification attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${Math.pow(2, i)} seconds...`);
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }
  console.log("Failed to verify email connection after all retries");
  return false;
};

export { verifyConnection };
export default mailSender;
