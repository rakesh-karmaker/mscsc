import config from "../config/config.js";
import { BrevoClient } from "@getbrevo/brevo";

export async function sendEmail(
  email: string,
  subject: string,
  content: string,
) {
  try {
    // Initialize Brevo client
    const brevo = new BrevoClient({
      apiKey: config.brevoApiKey,
    });

    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,
      htmlContent: content,
      sender: { name: "MSCSC", email: config.email },
      to: [{ email: email }],
    });

    console.log("Email sent to:", email, "Response:", result);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}
