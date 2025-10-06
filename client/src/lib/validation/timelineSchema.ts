import { z } from "zod/v3";

// Zod schema for form validation
export const timelineSchema = z.object({
  tag: z
    .string()
    .nullable()
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Tag is required",
    }),
  date: z
    .date()
    .nullable()
    .refine((value) => value !== null, {
      message: "Date is required",
    }),
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Title is required",
    }),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Description is required",
    }),
  link: z
    .string()
    .min(2, "Link must be at least 2 characters")
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Link is required",
    }),
});

// Type for the form data derived from the Zod schema
export type TimelineSchemaType = z.infer<typeof timelineSchema>;
