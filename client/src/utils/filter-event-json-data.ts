import type { FilteredEventDataType } from "@/types/event/event-types";
import dayjs from "dayjs";

export default function filterEventJSONData(data: any): FilteredEventDataType {
  const filteredData: FilteredEventDataType = {} as FilteredEventDataType;

  filteredData.eventName = data.eventName;
  filteredData.eventDate = data.eventDate;
  filteredData.eventLocation = data.eventLocation;
  filteredData.eventDescription = data.eventDescription;

  filteredData.registrationUrl = data.registrationUrl || "";
  filteredData.isInnerRegistration = data.isInnerRegistration || false;
  filteredData.hasCAForm = data.hasCAForm || false;

  const contactLinks: { platform: string; url: string }[] = [];
  if (data.contactLinks) {
    const links: { [platform: string]: string } = data.contactLinks;
    Object.keys(links).forEach((platform) => {
      if (links[platform]) {
        contactLinks.push({
          platform,
          url: links[platform],
        });
      }
    });
  }
  filteredData.contactLinks = contactLinks;

  if (filteredData.hasCAForm && data.caFormData) {
    filteredData.caFormData = {
      title: data.caFormData.title,
      applicationDeadline: data.caFormData.applicationDeadline,
      details: data.caFormData.details,
    };
  }

  if (filteredData.isInnerRegistration && data.formData) {
    filteredData.formData = {
      title: data.formData.title,
      fees: data.formData.fees,
      details: data.formData.details,
      registrationDeadline: data.formData.registrationDeadline,
    };

    if (data.formData.transactionMethods) {
      const transactionMethods: {
        [method: string]: {
          number: string;
          qrCodePublicId?: string;
          qrCodeUrl?: string;
        };
      } = {};

      for (const method of Object.keys(data.formData.transactionMethods)) {
        const transactionMethod = data.formData.transactionMethods?.[method];
        if (transactionMethod) {
          if (transactionMethod.qrCodeUrl) {
            transactionMethods[method] = {
              number: transactionMethod.number,
              qrCodeUrl: transactionMethod.qrCodeUrl,
              qrCodePublicId: transactionMethod.qrCodePublicId || "",
            };
          } else {
            transactionMethods[method] = {
              number: transactionMethod.number,
            };
          }
        }
      }
      filteredData.formData.transactionMethods = transactionMethods;
    }
  }

  filteredData.sections = data.sections || [];
  filteredData.hiddenSections = data.hiddenSections || [];

  if (filteredData.sections.includes("hero") && data.heroData) {
    filteredData.heroData = {
      heading: data.heroData.heading,
      text: data.heroData.text,
      icons: data.heroData.icons || [],
    };
  }

  if (filteredData.sections.includes("video") && data.videoData) {
    filteredData.videoData = {
      url: data.videoData.url,
      videoPublicId: data.videoData.videoPublicId,
    };
  }

  if (filteredData.sections.includes("about") && data.aboutData) {
    filteredData.aboutData = {
      title: data.aboutData.title,
      prizeCount: data.aboutData.prizeCount,
      heading: data.aboutData.heading,
      text: data.aboutData.text,
    };

    if (data.aboutData.aboutImageUrl && data.aboutData.aboutImagePublicId) {
      filteredData.aboutData.aboutImageUrl = data.aboutData.aboutImageUrl;
      filteredData.aboutData.aboutImagePublicId =
        data.aboutData.aboutImagePublicId;
    }
  }

  if (filteredData.sections.includes("segments") && data.segmentsData) {
    const segments: FilteredEventDataType["segmentsData"] = [];
    data.segmentsData.forEach((segment: any) => {
      if (segment.title && segment.details) {
        segments.push({
          locationType: segment.locationType,
          teamType: segment.teamType,
          title: segment.title,
          icon: segment.icon,
          summary: segment.summary,
          details: segment.details,
          rules: segment.rules,
          maxTeamSize: segment.maxTeamSize,
        });
      }
    });
    filteredData.segmentsData = segments;
  }

  if (filteredData.sections.includes("experiences") && data.experiencesData) {
    filteredData.experienceData = data.experiencesData.map(
      (experience: any) => ({
        icon: experience.icon,
        title: experience.title,
        details: experience.details,
      }),
    );
  }

  if (filteredData.sections.includes("schedule") && data.scheduleData) {
    const schedule: FilteredEventDataType["scheduleData"] = [];
    for (const date of Object.keys(data.scheduleData)) {
      if (data.scheduleData[date] && Array.isArray(data.scheduleData[date])) {
        data.scheduleData[date].forEach((item: any) => {
          if (item.title && item.icon) {
            schedule.push({
              title: item.title,
              date: dayjs(item.date).toISOString(),
              icon: item.icon,
              fromTime: item.fromTime,
              toTime: item.toTime,
              description: item.description,
            });
          }
        });
      }
    }

    filteredData.scheduleData = schedule;
  }

  if (filteredData.sections.includes("sp") && data.spData) {
    filteredData.spData = data.spData.map((sp: any) => ({
      name: sp.name,
      websiteUrl: sp.websiteUrl,
      logoUrl: sp.logoUrl,
      logoPublicId: sp.logoPublicId,
    }));
  }

  if (filteredData.sections.includes("faq") && data.faqData) {
    filteredData.faqData = data.faqData.map((faq: any) => ({
      question: faq.question,
      answer: faq.answer,
    }));
  }

  return filteredData;
}
