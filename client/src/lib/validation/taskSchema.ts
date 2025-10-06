import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { z } from "zod/v3";

// Define the schema for editing a task
export const taskSchema = z.object({
  name: z.string().min(1, "Name is required"),
  deadline: z.custom<Dayjs>((val) => dayjs.isDayjs(val), {
    message: "Deadline is required and must be a valid date",
  }),
  imageRequired: z.boolean().optional(),
  content: z.string().min(1, "Instructions are required"),
  summary: z.string().min(1, "Summary is required"),
  category: z.string().min(1, "Category is required"),
});

// Infer the TypeScript type from the Zod schema
export type TaskSchemaType = z.infer<typeof taskSchema>;
