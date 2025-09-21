import config from "./config.js";
import nodemailer from "nodemailer";

const mailSender = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.mailAddress,
    pass: config.mailPass,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
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
