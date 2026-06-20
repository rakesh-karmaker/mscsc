import Joi from "joi";

export const teamSchema = Joi.object({
  segmentSlug: Joi.string().required(),

  teamName: Joi.string().required(),
  leaderEmail: Joi.string().email().required(),
  memberEmails: Joi.array().items(Joi.string().email()).required(),

  transactionMethod: Joi.string().optional(),
  transactionPhoneNumber: Joi.string().optional(),
  transactionId: Joi.string().optional(),
});
