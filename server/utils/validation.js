const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
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

const messageSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
  message: Joi.string().required(),
});

const activitySchema = Joi.object({
  tag: Joi.string().required(),
  title: Joi.string().required(),
  summary: Joi.string().required(),
  date: Joi.date().required(),
  content: Joi.string().required(),
});

const taskSchema = Joi.object({
  name: Joi.string().required(),
  summary: Joi.string().required(),
  instructions: Joi.string().required(),
  champion: Joi.string(),
  deadline: Joi.date().required(),
  category: Joi.string().required(),
  imageRequired: Joi.boolean().required(),
});

// Add more schemas as needed
module.exports = {
  registerSchema,
  executiveSchema,
  messageSchema,
  activitySchema,
  taskSchema,
};
