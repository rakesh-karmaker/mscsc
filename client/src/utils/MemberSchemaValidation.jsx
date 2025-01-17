import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]; // Add more types as needed

const MemberRegSchema = z.object({
  name: z
    .string("Provide your name")
    .min(2, "Name must be at least 2 characters")
    .max(255),
  password: z
    .string("Provide your password")
    .min(8, "Password must be at least 8 characters"),
  email: z.string("Provide your email").email("Invalid email address"),
  batch: z
    .string("Select your ssc batch")
    .nullable()
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Batch is required",
    }),
  branch: z
    .string("Select your branch")
    .nullable()
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Branch is required",
    }),
  image: z
    .any()
    .nullable()
    .refine((files) => files.length > 0, {
      message: "Image is required",
    })
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `Max image size is ${MAX_FILE_SIZE / 1024}KB.`,
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: "Please upload a valid image file (JPG, JPEG, PNG or WebP).",
    }),
  reason: z
    .string("Give a description of why you want to join the club")
    .nullable()
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Reason is required",
    }),
  socialLink: z
    .string("Enter your facebook link")
    .nullable()
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Social link is required",
    }),
  reference: z
    .string("Enter your reference")
    .nullable()
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Reference is required",
    }),
});

const MemberLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const MemberProfileEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  email: z.string().email("Invalid email address"),
  password: z.string().refine((value) => value === "" || value.length >= 6, {
    message: "Password must be at least 6 characters",
  }),
  image: z
    .any()
    .optional()
    .refine(
      (files) => files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
      {
        message: `Max image size is ${MAX_FILE_SIZE / 1024}KB.`,
      }
    )
    .refine(
      (files) =>
        files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      {
        message: "Please upload a valid image file (JPG, JPEG, PNG or WebP).",
      }
    ),
  branch: z.string("Select your branch"),
  reason: z.string("Give a description of why you want to join the club"),
  socialLink: z.string("Enter your facebook link"),
  batch: z
    .string()
    .length(4, "Invalid Batch")
    .refine((value) => value !== null && value.toString().trim() !== "", {
      message: "Invalid Batch",
    }),
});

const TimelineSchema = z.object({
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

export {
  MemberRegSchema,
  MemberLoginSchema,
  MemberProfileEditSchema,
  TimelineSchema,
};
