import config from "../config/config.js";
import mailSender from "../config/mailSender.js";
import otpDraft from "../utils/otpDraft.js";

export default async function sendEmail(email: string, otp: string) {
  try {
    await mailSender.sendMail({
      from: config.mailAddress,
      to: email,
      subject: "Password Reset OTP",
      html: otpDraft(otp),
    });
    return;
  } catch (err) {
    console.log("Error sending email - ", new Date(), "\n---\n", err);
  }
}
