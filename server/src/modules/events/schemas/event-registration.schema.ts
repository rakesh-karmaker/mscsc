import Joi from "joi";

export const eventRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  facebookUrl: Joi.string().uri().required(),
  institution: Joi.string().required(),
  grade: Joi.string().required(),
  segments: Joi.array().items(Joi.string()).required(),

  transactionMethod: Joi.string().required(),
  transactionPhoneNumber: Joi.string().required(),
  transactionId: Joi.string().required(),
  reference: Joi.string().required(),
});
