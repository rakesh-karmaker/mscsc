import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(2).max(255),
  message: z.string().min(2),
});

export default contactSchema;
