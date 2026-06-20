import { z } from "zod/v3";

// Zod schema for form validation
export const teamEditSchema = z.object({
  teamName: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(255),
  leaderEmail: z.string().email("Invalid email address").max(255),
  status: z.enum(["pending", "approved", "rejected"]),
  memberEmails: z.any(),
});

// Infer the TypeScript type from the Zod schema
export type TeamEditSchema = z.infer<typeof teamEditSchema>;
