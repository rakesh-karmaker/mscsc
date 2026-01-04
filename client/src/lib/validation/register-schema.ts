import { z } from "zod/v3";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

type FileFromForm = FileList;

// Zod schema for form validation
export const registerSchema = z.object({
  name: z
    .string({ required_error: "Provide your name" })
    .min(2, "Name must be at least 2 characters")
    .max(255),
  password: z
    .string({ required_error: "Provide your password" })
    .min(8, "Password must be at least 8 characters"),
  email: z.string().superRefine((val, ctx) => {
    const trimmedVal = val.trim();
    if (!z.string().email().safeParse(trimmedVal).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid email address",
      });
    }
  }),
  contactNumber: z
    .string({ required_error: "Provide your contact number" })
    .min(10, "Contact number must be at least 10 characters"),
  batch: z
    .string({ required_error: "Select your ssc batch" })
    .min(4, "Batch must be at least 4 characters")
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Batch is required",
    })
    .refine(
      (value) =>
        value
          ? Array.from(value).every((char) => !/[A-Za-z]/.test(char))
          : false,
      {
        message: "Batch must contain only numbers",
      }
    ),
  branch: z
    .string({ required_error: "Select your branch" })
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Branch is required",
    }),
  image: z
    .custom<FileFromForm>((fileList) => fileList instanceof FileList, {
      message: "Please upload a valid file",
    })
    .refine(
      (files) =>
        files.length > 0 &&
        files[0].size <= MAX_FILE_SIZE &&
        ACCEPTED_IMAGE_TYPES.includes(
          files[0].type as (typeof ACCEPTED_IMAGE_TYPES)[number]
        ),
      (files) => ({
        message:
          files.length === 0
            ? "Image is required"
            : files[0].size > MAX_FILE_SIZE
            ? `Max image size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
            : "Only JPG, JPEG, PNG, and WebP formats are supported.",
      })
    ),
  reason: z
    .string({ required_error: "Give a description of yourself" })
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Description is required",
    }),
  socialLink: z
    .string({ required_error: "Enter your facebook link" })
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Social link is required",
    }),
  reference: z
    .string({ required_error: "Enter your reference" })
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Reference is required",
    }),
  consent: z.boolean().refine((value) => value === true, {
    message: "Consent is required",
  }),
});

// Type for the form data derived from the Zod schema
export type RegisterSchemaType = z.infer<typeof registerSchema>;
