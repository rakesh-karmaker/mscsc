import { z } from "zod";

const MAX_FILE_SIZE = 0.5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]; // Add more types as needed

const MemberSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  contactNumber: z.coerce.number().gte(1).lte(99999999999),
  batch: z.string(),
  branch: z.string(),
  image: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `Max image size is ${MAX_FILE_SIZE / 1024}KB.`,
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: "Please upload a valid image file (JPG, JPEG, PNG or WebP).",
    }),
  reason: z.string(),
  socialLink: z.string(),
  reference: z.string(),
});

export default MemberSchema;
