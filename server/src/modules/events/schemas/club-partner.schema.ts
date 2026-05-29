import Joi from "joi";

export const clubPartnerSchema = Joi.object({
  clubName: Joi.string().required(),
  clubEmail: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  facebookUrl: Joi.string().uri().required(),

  institution: Joi.string().required(),
  address: Joi.string().required(),

  moderatorName: Joi.string().optional(),
  moderatorEmail: Joi.string().email().optional(),
  moderatorPhoneNumber: Joi.string().optional(),

  code: Joi.string().required(),
});
