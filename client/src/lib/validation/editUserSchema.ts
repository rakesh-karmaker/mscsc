import { z } from "zod/v3";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

type FileListLike = {
  length: number;
  0?: {
    size: number;
    type: string;
  };
};

// Zod schema for form validation
export const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  email: z.string().email("Invalid email address"),
  password: z.string().refine((value) => value === "" || value.length >= 6, {
    message: "Password must be at least 6 characters",
  }),
  image: z
    .custom<FileListLike>(
      (files) => {
        return (
          !files || files.length === 0 || (files[0]?.size ?? 0) <= MAX_FILE_SIZE
        );
      },
      {
        message: `Max image size is ${MAX_FILE_SIZE / 1024}KB.`,
      }
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        (files[0]?.type &&
          ACCEPTED_IMAGE_TYPES.includes(
            files[0]?.type as (typeof ACCEPTED_IMAGE_TYPES)[number]
          )),
      {
        message: "Please upload a valid image file (JPG, JPEG, PNG or WebP).",
      }
    ),
  branch: z.string({ required_error: "Select your branch" }),
  reason: z.string({
    required_error: "Give a description of why you want to join the club",
  }),
  socialLink: z.string({ required_error: "Enter your facebook link" }),
  contactNumber: z
    .string({ required_error: "Provide your contact number" })
    .min(10, "Contact number must be at least 10 characters"),
  batch: z
    .string({ required_error: "Select your ssc batch" })
    .min(4, "Batch must be at least 4 characters")
    .nullable()
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Batch is required",
    })
    .optional()
    .refine(
      (value) =>
        !value || Array.from(value).every((char) => !/[A-Za-z]/.test(char)),
      {
        message: "Batch must contain only numbers",
      }
    ),
});

// Type for the form data derived from the Zod schema
export type EditUserSchemaType = z.infer<typeof editUserSchema>;
