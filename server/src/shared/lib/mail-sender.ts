import config from "../config/config.js";
import axios from "axios";

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
      console.log("Email sent successfully:", res.data);
    } else {
      console.log("Error sending email:", res.data);
    }

    return;
  } catch (err) {
    console.log("Error sending email - ", new Date(), "\n---\n", err);
  }
}
