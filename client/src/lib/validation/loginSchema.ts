import { z } from "zod/v3";

// Zod schema for form validation
export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email address",
  }),
  password: z
    .string({ required_error: "Password is required" })
    .min(2, "Password must be at least 2 characters"),
});

// Type for the form data derived from the Zod schema
export type LoginSchemaType = z.infer<typeof loginSchema>;
