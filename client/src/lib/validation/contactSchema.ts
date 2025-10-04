import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email address" }),
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(2, "Subject must be at least 2 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(2, "Message must be at least 2 characters"),
});

export type ContactSchemaType = z.infer<typeof contactSchema>;
