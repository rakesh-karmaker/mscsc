import config from "../config/config.js";
import axios from "axios";
import logger from "../config/winston.js";

export async function sendEmail(
  email: string,
  subject: string,
  content: string,
) {
  try {
    const res = await axios.post(`${config.mailServerUrl}/send-mail`, {
      to: email,
      subject: subject,
      isHtml: true,
      body: content,
    });

    if (res.status === 200) {
      logger.info("log", "Email sent successfully", {
        email: email,
        subject: subject,
      });
      console.log("Email sent successfully:", res.data);
    } else {
      logger.error("Error sending email", {
        email: email,
        subject: subject,
        error: res.data,
      });
    }

    return res.status === 200;
  } catch (err) {
    logger.error("Error sending email", {
      email: email,
      subject: subject,
      error: err,
    });
    return false;
  }
}
