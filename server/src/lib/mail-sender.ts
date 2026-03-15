import config from "../config/config.js";
import {
  eventConfirmationDraft,
  EventConfirmationDraftProps,
} from "../utils/otp-draft.js";
import { BrevoClient } from "@getbrevo/brevo";

export async function sendEmail(
  email: string,
  data: EventConfirmationDraftProps,
) {
  try {
    // Initialize Brevo client
    const brevo = new BrevoClient({
      apiKey: config.brevoApiKey,
    });

    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: `You are all set for the ${data.eventName}, ${data.name}!`,
      htmlContent: eventConfirmationDraft(data),
      sender: { name: "MSCSC", email: config.email },
      to: [{ email: email }],
    });

    console.log("Email sent to:", email, "Response:", result);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}
