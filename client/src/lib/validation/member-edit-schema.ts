import { z } from "zod/v3";

// Zod schema for form validation
export const memberEditSchema = z.object({
  position: z
    .string()
    .min(2, "Position must be at least 2 characters")
    .max(255),
  role: z.string().min(2, "Role must be at least 2 characters").max(255),
  showImage: z.boolean().optional(),
});

// Infer the TypeScript type from the Zod schema
export type MemberEditSchema = z.infer<typeof memberEditSchema>;
