import Joi from "joi";

export const activitySchema = Joi.object({
  tag: Joi.string().required(),
  title: Joi.string().required(),
  summary: Joi.string().required(),
  date: Joi.date().required(),
  content: Joi.string().required(),
});
