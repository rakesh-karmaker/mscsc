import Joi from "joi";

export const caApplicationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  facebookUrl: Joi.string().uri().required(),
  address: Joi.string().required(),
  gender: Joi.string().valid("male", "female").required(),
  institution: Joi.string().required(),
  grade: Joi.string().required(),
  description: Joi.string().required(),
  hasPreviousExperience: Joi.string().valid("yes", "no").required(),
  previousExperienceDetails: Joi.string().when("hasPreviousExperience", {
    is: "yes",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
});
