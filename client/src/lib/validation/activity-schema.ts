import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { z } from "zod/v3";

// Define the schema for editing an activity
export const activitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.custom<Dayjs>((val) => dayjs.isDayjs(val), {
    message: "Date is required and must be a valid date",
  }),
  activityImage: z.any().optional(),
  gallery: z.any().optional(),
  tag: z.string().min(1, "Tag is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
});

// Infer the TypeScript type from the Zod schema
export type ActivitySchemaType = z.infer<typeof activitySchema>;
