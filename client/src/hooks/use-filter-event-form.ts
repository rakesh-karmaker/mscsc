import type { ExperienceType, SegmentType } from "@/types/event-types";
import generateSlug from "@/utils/generate-slug";

type useFilterEventFormProps = {
  data: any;
  sections: string[];
};

export default function useFilterEventForm({
  data,
  sections,
}: useFilterEventFormProps): {
  filteredData: any;
} {
  let filteredData: any = {};

  const basicInfoFields = {
    template: "Explorion", // default template
    eventName: data.eventName,
    eventDate: data.eventDate,
    eventLocation: data.eventLocation,
    eventDescription: data.eventDescription,
    registrationUrl: data.registrationUrl,
    isInnerRegistration: data.isInnerRegistration,
    hasCAForm: data.hasCAForm,
  };

  const contactInfoFields: { [platform: string]: string }[] =
    data.contactLinks.map(({ platform, url }: any) => ({
      [platform]: url,
    }));

  const formDataFields = {
    registrationDeadline: data.formData.registrationDeadline,
    ...(data.isInnerRegistration
      ? {
          title: data.formData.title,
          details: data.formData.details,
          fees: data.formData.fees,
          transactionMethods: data.formData.transactionMethods,
        }
      : {}),
  };

  const caFormFields = data.hasCAForm
    ? {
        title: data.caFormData.title,
        details: data.caFormData.details,
        applicationDeadline: data.caFormData.applicationDeadline,
      }
    : {};

  filteredData = {
    ...basicInfoFields,
    contactLinks: contactInfoFields,
    formData: formDataFields,
    ...(data.hasCAForm ? { caFormData: caFormFields } : {}),
  };

  // only include the fields for the sections that are selected
  if (sections.includes("hero")) {
    filteredData.heroData = {
      heading: data.heroData.heading,
      text: data.heroData.text,
      icons: [data.heroIcon1, data.heroIcon2, data.heroIcon3, data.heroIcon4],
    };
  }

  if (sections.includes("about")) {
    filteredData.aboutData = {
      title: data.aboutData.title,
      prizeCount: data.aboutData.prizeCount,
      heading: data.aboutData.heading,
      text: data.aboutData.text,
    };
  }

  if (sections.includes("segments")) {
    filteredData.segmentsData = data.segmentsData.map(
      (segment: Omit<SegmentType, "segmentSlug">) => ({
        ...segment,
        segmentSlug: generateSlug(segment.title),
      }),
    );
  }

  if (sections.includes("experiences")) {
    filteredData.experiencesData = data.experiencesData.map(
      (experience: Omit<ExperienceType, "experienceSlug">) => ({
        ...experience,
        experienceSlug: generateSlug(experience.title),
      }),
    );
  }

  if (sections.includes("sp")) {
    filteredData.spData = data.spData;
  }

  if (sections.includes("faq")) {
    filteredData.faqData = data.faqData;
  }

  return { filteredData };
}
