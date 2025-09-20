import Joi from "joi";

// Define the validation schema for user registration
export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  contactNumber: Joi.string().required(),
  batch: Joi.string().required(),
  branch: Joi.string().required(),
  reason: Joi.string().required(),
  socialLink: Joi.string().required(),
  reference: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
