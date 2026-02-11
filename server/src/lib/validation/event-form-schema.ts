import Joi from "joi";

export const eventFormSchema = Joi.object({
  basicInfo: Joi.object({
    template: Joi.string().required(),
    eventName: Joi.string().required(),
    eventDate: Joi.string().required(),
    eventLocation: Joi.string().required(),
    eventDescription: Joi.string().required(),
    registrationUrl: Joi.string().optional().allow(""),
    isInnerRegistration: Joi.boolean().required(),
    hasCAForm: Joi.boolean().required(),
  }).required(),

  sections: Joi.array().items(Joi.string()).required(),
  hiddenSections: Joi.array().items(Joi.string()).required(),

  contactLinks: Joi.object().pattern(Joi.string(), Joi.string()).required(),

  formData: Joi.object({
    registrationDeadline: Joi.string().required(),
    title: Joi.string().optional(),
    details: Joi.string().optional(),
    fees: Joi.string().optional(),
    transactionMethods: Joi.object()
      .pattern(
        Joi.string(),
        Joi.object({
          number: Joi.string().required(),
        }),
      )
      .optional(),
  }).required(),

  caFormData: Joi.object({
    title: Joi.string().required(),
    details: Joi.string().required(),
    applicationDeadline: Joi.string().required(),
  }).optional(),

  heroData: Joi.object({
    heading: Joi.string().required(),
    text: Joi.string().required(),
    icons: Joi.array().items(Joi.string()).required(),
  }).optional(),

  aboutData: Joi.object({
    title: Joi.string().required(),
    prizeCount: Joi.number().required(),
    heading: Joi.string().required(),
    text: Joi.string().required(),
  }).optional(),

  segmentsData: Joi.array()
    .items(
      Joi.object({
        segmentSlug: Joi.string().required(),
        locationType: Joi.string().valid("onsite", "online").required(),
        teamType: Joi.string().valid("solo", "team").required(),
        icon: Joi.string().required(),
        title: Joi.string().required(),
        summary: Joi.string().required(),
        details: Joi.string().required(),
        rules: Joi.string().required(),
      }),
    )
    .optional(),

  experiencesData: Joi.array()
    .items(
      Joi.object({
        experienceSlug: Joi.string().required(),
        icon: Joi.string().required(),
        title: Joi.string().required(),
        details: Joi.string().required(),
      }),
    )
    .optional(),

  scheduleData: Joi.object()
    .pattern(
      Joi.string(),
      Joi.array().items(
        Joi.object({
          icon: Joi.string().required(),
          fromTime: Joi.string().required(),
          toTime: Joi.string().required(),
          title: Joi.string().required(),
          description: Joi.string().required(),
        }),
      ),
    )
    .optional(),

  spData: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        websiteUrl: Joi.string().required(),
      }),
    )
    .optional(),

  faqData: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
      }),
    )
    .optional(),
});
