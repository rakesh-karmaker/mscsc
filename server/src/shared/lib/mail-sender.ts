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
      logger.info(`Email sent successfully to ${email}`, {
        email: email,
        subject: subject,
      });
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
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return false;
  }
}
