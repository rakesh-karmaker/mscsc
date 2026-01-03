import axios from "axios";
import config from "../config/config.js";

export default async function sendEmail(email: string, otp: string) {
  try {
    const res = await axios.post(`${config.mailServerUrl}/mail/send`, {
      to: email,
      otp: otp,
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
