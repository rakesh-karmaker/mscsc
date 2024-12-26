import { z } from "zod";

const MAX_FILE_SIZE = 0.5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]; // Add more types as needed

const MemberRegSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Invalid contact number"),
  batch: z.string("Select your ssc batch"),
  branch: z.string("Select your branch"),
  image: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `Max image size is ${MAX_FILE_SIZE / 1024}KB.`,
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: "Please upload a valid image file (JPG, JPEG, PNG or WebP).",
    }),
  reason: z.string("Give a description of why you want to join the club"),
  socialLink: z.string("Enter your facebook link"),
  reference: z.string("Enter your reference"),
});

const MemberLoginSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
});

const MemberProfileEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  contactNumber: z.string().min(10, "Invalid contact number"),
  branch: z.string("Select your branch"),
  reason: z.string("Give a description of why you want to join the club"),
  socialLink: z.string("Enter your facebook link"),
  timeLine: z
    .object({
      tag: z.string(),
      date: z.date(),
      title: z.string(),
      description: z.string(),
      link: z.string(),
    })
    .array()
    .optional(),
});

export { MemberRegSchema, MemberLoginSchema, MemberProfileEditSchema };
