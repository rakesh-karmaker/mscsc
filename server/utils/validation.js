const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  contactNumber: Joi.string().required(),
  batch: Joi.string().required(),
  branch: Joi.string().required(),
  reason: Joi.string().required(),
  socialLink: Joi.string().required(),
  reference: Joi.string().required(),
  password: Joi.string().min(6).optional(),
});

const executiveSchema = Joi.object({
  name: Joi.string().required(),
  about: Joi.string().required(),
  socialLinks: Joi.array().items(Joi.string().uri()),
  image: Joi.string().required(),
});

// Add more schemas as needed
module.exports = { registerSchema, executiveSchema };
