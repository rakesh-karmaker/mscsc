import { z } from "zod/v3";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

type FileFromForm = FileList;

// Zod schema for form validation
export const clubPartnerSchema = z.object({
  clubName: z
    .string({ required_error: "Provide the club name" })
    .min(2, "Club name must be at least 2 characters")
    .max(255),
  clubEmail: z
    .string({ required_error: "Provide the club email" })
    .email("Invalid email address"),
  phoneNumber: z
    .string({ required_error: "Provide the club phone number" })
    .min(10, "Phone number must be at least 10 characters"),
  facebookUrl: z
    .string({ required_error: "Provide the club Facebook URL" })
    .url("Invalid URL format"),
  institution: z
    .string({ required_error: "Provide the club's institution" })
    .min(2, "Institution must be at least 2 characters")
    .max(255),
  address: z
    .string({ required_error: "Provide the club's address" })
    .min(5, "Address must be at least 5 characters")
    .max(500),
  moderatorName: z.any().optional(),
  moderatorEmail: z.any().optional(),
  moderatorPhoneNumber: z.any().optional(),

  code: z
    .string({ required_error: "Provide the club partner code" })
    .min(2, "Code must be at least 2 characters")
    .max(255),

  status: z.enum(["active", "inactive"], {
    required_error: "Provide the club partner status",
    invalid_type_error: "Status must be either 'active' or 'inactive'",
  }),

  clubLogo: z
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
});

// Infer the TypeScript type from the Zod schema
export type ClubPartnerFormData = z.infer<typeof clubPartnerSchema>;
