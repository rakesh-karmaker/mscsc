import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
    .string("Provide your contact number")
    .min(10, "Contact number must be at least 10 characters"),
  batch: z
    .string("Select your ssc batch")
    .min(4, "Batch must be at least 4 characters")
    .nullable()
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Batch is required",
    })
    .refine(
      (value) => Array.from(value).every((char) => !/[A-Za-z]/.test(char)),
      {
        message: "Batch must contain only numbers",
      }
    ),
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
      message: `Max image size is ${MAX_FILE_SIZE}MB.`,
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: "Please upload a valid image file (JPG, JPEG, PNG or WebP).",
    }),
  reason: z
    .string("Give a description of yourself")
    .nullable()
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Description is required",
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
  consent: z.boolean().refine((value) => value === true, {
    message: "Consent is required",
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
        message: `Max image size is ${MAX_FILE_SIZE}MB.`,
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
  contactNumber: z
    .string("Provide your contact number")
    .min(10, "Contact number must be at least 10 characters"),
  batch: z
    .string("Select your ssc batch")
    .min(4, "Batch must be at least 4 characters")
    .nullable()
    .refine((value) => value !== null && value.trim() !== "", {
      message: "Batch is required",
    })
    .refine(
      (value) => Array.from(value).every((char) => !/[A-Za-z]/.test(char)),
      {
        message: "Batch must contain only numbers",
      }
    ),
    hideImage: z.boolean().optional(),
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
