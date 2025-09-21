import Joi from "joi";

export const taskSchema = Joi.object({
  name: Joi.string().required(),
  summary: Joi.string().required(),
  instructions: Joi.string().required(),
  champion: Joi.string(),
  deadline: Joi.date().required(),
  category: Joi.string().required(),
  imageRequired: Joi.boolean().required(),
});
