import type {
  BasicInfoType,
  CAFromDataType,
  EventFormDataType,
  ExperienceType,
  FormDataType,
  RawScheduleItemType,
  ScheduleDataType,
  SegmentType,
  SpType,
} from "@/types/event/event-types";
import generateSlug from "@/utils/generate-slug";
import dayjs from "dayjs";

type useFilterEventFormProps = {
  data: any;
  sections: string[];
  mode: "add" | "edit";
};

export default function useFilterEventForm({
  data,
  sections,
  mode,
}: useFilterEventFormProps): {
  filteredData: EventFormDataType;
} {
  let filteredData: EventFormDataType = {} as EventFormDataType;

  console.log("Raw Data:", data);

  const basicInfoFields: BasicInfoType = {
    template: "Explorion", // default template change it later if you want
    eventName: data.eventName,
    eventDate: data.eventDate,
    eventLocation: data.eventLocation,
    eventDescription: data.eventDescription,
    registrationUrl: data.registrationUrl || "",
    isInnerRegistration: data.isInnerRegistration || false,
    hasCAForm: data.hasCAForm || false,
  };

  const contactInfoFields: { [platform: string]: string } =
    data.contactLinks.reduce(
      (
        acc: { [platform: string]: string },
        { platform, url }: { platform: string; url: string },
      ) => {
        acc[platform] = url;
        return acc;
      },
      {},
    );

  let transactionMethods: FormDataType["transactionMethods"] = {};
  if (data.isInnerRegistration) {
    const methods = Object.keys(data.formData.transactionMethods || {});
    methods.forEach((method) => {
      if (
        data.formData.transactionMethods[method] &&
        data.formData.transactionMethods[method].number
      ) {
        if (data.formData.transactionMethods[method].qrCodeUrl) {
          transactionMethods[method] = {
            number: data.formData.transactionMethods[method].number,
            qrCodePublicId:
              data.formData.transactionMethods[method].qrCodePublicId || "",
            qrCodeUrl: data.formData.transactionMethods[method].qrCodeUrl || "",
          };
        } else {
          transactionMethods[method] = {
            number: data.formData.transactionMethods[method].number,
          };
        }
      }
    });
  }

  const formDataFields: FormDataType = {
    registrationDeadline: data.formData.registrationDeadline,
    ...(data.isInnerRegistration
      ? {
          title: data.formData.title,
          details: data.formData.details,
          fees: data.formData.fees,
          transactionMethods: transactionMethods,
        }
      : {}),
  };

  if (data.isInnerRegistration) {
    if (data.bkashQrCode && data.bkashQrCode.length > 0) {
      filteredData.bkashQrCode = data.bkashQrCode[0];
    }

    if (data.nagadQrCode && data.nagadQrCode.length > 0) {
      filteredData.nagadQrCode = data.nagadQrCode[0];
    }

    if (data.rocketQrCode && data.rocketQrCode.length > 0) {
      filteredData.rocketQrCode = data.rocketQrCode[0];
    }
  }

  const caFormFields: CAFromDataType | null = data.hasCAForm
    ? {
        title: data.caFormData.title,
        details: data.caFormData.details,
        applicationDeadline: data.caFormData.applicationDeadline,
      }
    : null;

  filteredData = {
    ...filteredData,
    basicInfo: basicInfoFields,
    sections: sections,
    hiddenSections: data.hiddenSections || [],
    contactLinks: contactInfoFields,
    formData: formDataFields,
    eventLogo: data.eventLogo[0],
    eventFavicon: data.eventFavicon[0],
    eventBanner: data.eventBanner[0],
  };

  if (caFormFields) {
    filteredData.caFormData = caFormFields;
  }

  // only include the fields for the sections that are selected
  if (sections.includes("hero")) {
    filteredData.heroData = {
      heading: data.heroData.heading,
      text: data.heroData.text,
      icons: [data.heroIcon1, data.heroIcon2, data.heroIcon3, data.heroIcon4],
    };
  }

  if (
    sections.includes("video") &&
    data.videoFile &&
    data.videoFile.length > 0
  ) {
    filteredData.videoFile = data.videoFile[0];
    if (data.videoData.url) {
      filteredData.videoData = {
        url: data.videoData.url,
        videoPublicId: data.videoData.videoPublicId,
      };
    }
  }

  if (sections.includes("about")) {
    filteredData.aboutData = {
      title: data.aboutData.title,
      prizeCount: data.aboutData.prizeCount,
      heading: data.aboutData.heading,
      text: data.aboutData.text,
    };

    if (data.aboutImageUrl) {
      filteredData.aboutData.aboutImageUrl = data.aboutImageUrl;
      filteredData.aboutData.aboutImagePublicId = data.aboutImagePublicId;
    }

    if (data.aboutImageFile && data.aboutImageFile.length > 0) {
      filteredData.aboutImage = data.aboutImageFile[0];
    }
  }

  if (sections.includes("segments")) {
    filteredData.segmentsData = data.segmentsData.map(
      (segment: Omit<SegmentType, "segmentSlug">) => ({
        ...segment,
        segmentSlug: generateSlug(segment.title, false),
      }),
    );
  }

  if (sections.includes("experiences")) {
    filteredData.experiencesData = data.experienceData.map(
      (experience: Omit<ExperienceType, "experienceSlug">) => ({
        ...experience,
        experienceSlug: generateSlug(experience.title, false),
      }),
    );
  }

  if (sections.includes("schedule")) {
    const rawScheduleData: RawScheduleItemType[] = data.scheduleData;

    // format them according to date
    const formattedScheduleData: ScheduleDataType = {};
    rawScheduleData.forEach((item) => {
      const { date, ...rest } = item;
      const formattedDate = dayjs(date).format("MMM D, YYYY");
      if (!formattedScheduleData[formattedDate]) {
        formattedScheduleData[formattedDate] = [];
      }
      formattedScheduleData[formattedDate].push(rest);
    });

    filteredData.scheduleData = formattedScheduleData;
  }

  if (sections.includes("sp")) {
    const spData: SpType[] = [];
    data.spData.forEach((sp: SpType & { logoFile: File[] }) => {
      if (sp.logoUrl && sp.logoPublicId) {
        spData.push({
          name: sp.name,
          websiteUrl: sp.websiteUrl,
          logoUrl: sp.logoUrl,
          logoPublicId: sp.logoPublicId,
        });
      } else {
        spData.push({
          name: sp.name,
          websiteUrl: sp.websiteUrl,
        });
      }
    });

    const spLogos: File[] = [];
    data.spData.forEach((sp: SpType & { logoFile: File[] }) => {
      if (sp.logoFile && sp.logoFile.length > 0) {
        if (mode === "add") {
          spLogos.push(sp.logoFile[0]);
        } else {
          spLogos.push(
            new File([sp.logoFile[0]], sp.logoPublicId || "sp-logo.jpg", {
              type: sp.logoFile[0].type,
            }),
          );
        }
      }
    });

    filteredData.spData = spData;
    filteredData.spLogos = spLogos;
  }

  if (sections.includes("faq")) {
    filteredData.faqData = data.faqData;
  }

  console.log("Filtered Data:", filteredData);

  return { filteredData };
}
