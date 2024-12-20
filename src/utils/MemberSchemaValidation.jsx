import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]; // Add more types as needed

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const MemberSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  contactNumber: z.coerce.number().gte(1).lte(99999999999),
  batch: z.string(),
  branch: z.string(),
  image: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `Max image size is ${MAX_FILE_SIZE}MB.`,
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: "Please upload a valid image file (JPG, JPEG, PNG or WebP).",
    }),
  reason: z.string(),
  socialLink: z.string(),
  reference: z.string().optional(),
});

export default MemberSchema;
