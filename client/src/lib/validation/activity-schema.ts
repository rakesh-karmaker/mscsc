import { z } from "zod/v3";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

type FileFromForm = FileList;

// Define the schema for editing an activity
export const activitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.any(),
  activityImage: z
    .custom<FileFromForm>((fileList) => fileList instanceof FileList, {
      message: "Please upload a valid file",
    })
    .refine(
      (files) =>
        files.length > 0 &&
        files[0].size <= MAX_FILE_SIZE &&
        ACCEPTED_IMAGE_TYPES.includes(
          files[0].type as (typeof ACCEPTED_IMAGE_TYPES)[number],
        ),
      (files) => ({
        message:
          files.length === 0
            ? "Image is required"
            : files[0].size > MAX_FILE_SIZE
              ? `Max image size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
              : "Only JPG, JPEG, PNG, and WebP formats are supported.",
      }),
    ),
  gallery: z.any().optional(),
  tag: z.string().min(1, "Tag is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
});

export const editActivitySchema = activitySchema.extend({
  activityImage: z.any().optional(),
  date: z.any().optional(),
});

// Infer the TypeScript type from the Zod schema
export type ActivitySchemaType = z.infer<typeof activitySchema>;
export type EditActivitySchemaType = z.infer<typeof editActivitySchema>;
