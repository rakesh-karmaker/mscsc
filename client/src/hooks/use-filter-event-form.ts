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
          transactionPlatforms: data.formData.transactionPlatforms,
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
      icons:
        !data.heroIcon1 || !data.heroIcon2 || !data.heroIcon3 || !data.heroIcon4
          ? data.heroData.icons || []
          : [data.heroIcon1, data.heroIcon2, data.heroIcon3, data.heroIcon4],
    };
  }

  if (sections.includes("video")) {
    if (data.videoData?.url) {
      filteredData.videoData = {
        url: data.videoData.url,
        hasAudio: data.videoData.hasAudio || false,
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
    const segmentData: SegmentType[] = [];
    const segmentTMethodQrs: File[] = [];

    data.segmentsData.forEach((segment: any) => {
      if (!segment.title) return;

      const segmentDataItem: SegmentType = {
        segmentSlug: generateSlug(segment.title, false),
        locationType: segment.locationType || "onsite",
        teamType: segment.teamType || "solo",
        icon: segment.icon || "bulb",
        title: segment.title || "",
        summary: segment.summary || "",
        details: segment.details || "",
        rules: segment.rules || "",
        maxTeamSize: segment.maxTeamSize?.toString() || "1",
        isPaidSegment: segment.isPaidSegment || false,
        fees: parseFloat(segment.fees) || 0,
        transactionPlatforms: segment.transactionPlatforms || [],
      };

      if (!segment.transactionMethods) {
        segmentData.push(segmentDataItem);
        return;
      }

      const methods = Object.keys(segment.transactionMethods || {});
      methods.forEach((method) => {
        if (!segment.transactionMethods[method]) return;

        if (!segmentDataItem.transactionMethods) {
          segmentDataItem.transactionMethods = {};
        }

        const transactionMethod: {
          number: string;
          code?: string;
          qrCodeUrl?: string;
          qrCodePublicId?: string;
        } = {} as {
          number: string;
          code?: string;
          qrCodeUrl?: string;
          qrCodePublicId?: string;
        };

        if (segment.transactionMethods[method].number) {
          transactionMethod["number"] =
            segment.transactionMethods[method].number;
        } else {
          return;
        }

        if (segment.transactionMethods[method]?.code) {
          transactionMethod["code"] = segment.transactionMethods[method].code;
        }

        if (segment.transactionMethods[method]?.qrCodeUrl) {
          transactionMethod["qrCodeUrl"] =
            segment.transactionMethods[method].qrCodeUrl;
          transactionMethod["qrCodePublicId"] =
            segment.transactionMethods[method].qrCodePublicId || "";
        }

        segmentDataItem.transactionMethods[method] = transactionMethod;

        if (segment.transactionMethods[method]?.qrCode) {
          if (
            Array.isArray(segment.transactionMethods[method].qrCode) &&
            segment.transactionMethods[method].qrCode.length > 0
          ) {
            segmentTMethodQrs.push(
              segment.transactionMethods[method].qrCode[0],
            );
          } else if (
            segment.transactionMethods[method].qrCode instanceof File
          ) {
            segmentTMethodQrs.push(segment.transactionMethods[method].qrCode);
          }
        }
      });

      if (Object.keys(segmentDataItem.transactionMethods || {}).length === 0) {
        delete segmentDataItem.transactionMethods;
      }
      segmentData.push(segmentDataItem);
    });

    filteredData.segmentsData = segmentData;
    filteredData.segmentTMethodQrs = segmentTMethodQrs;
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

  if (sections.includes("faqs")) {
    filteredData.faqData = data.faqData;
  }

  return { filteredData };
}
