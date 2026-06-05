import type { EventFormDataType } from "@/types/event/event-types";
import useFilterEventForm from "./use-filter-event-form";

type useEventFormValidatorProps = {
  data: any;
  setError: any;
  clearErrors?: any;
  isEditMode: boolean;
};

export default function useEventFormValidator({
  data,
  setError,
  clearErrors,
  isEditMode = false,
}: useEventFormValidatorProps): {
  filteredData: EventFormDataType;
  isValid: boolean;
} {
  let isValid: boolean = true;
  const mode = isEditMode ? "edit" : "add";

  // clear manual errors from previous submit (if provided)
  if (typeof clearErrors === "function") {
    clearErrors();
  }

  // validate the form's basic data
  if (!data.eventDate) {
    setError("eventDate", {
      type: "manual",
      message: "Event date is required",
    });
    isValid = false;
  }

  // registration deadline lives inside `formData`
  if (!data.formData || !data.formData.registrationDeadline) {
    setError("formData.registrationDeadline", {
      type: "manual",
      message: "Registration deadline is required",
    });
    isValid = false;
  }

  if ((!data.eventLogo || !data.eventLogo.length) && mode === "add") {
    setError("eventLogo", {
      type: "manual",
      message: "Event logo is required",
    });
    isValid = false;
  }

  if ((!data.eventFavicon || !data.eventFavicon.length) && mode === "add") {
    setError("eventFavicon", {
      type: "manual",
      message: "Event favicon logo is required",
    });
    isValid = false;
  }

  if ((!data.eventBanner || !data.eventBanner.length) && mode === "add") {
    setError("eventBanner", {
      type: "manual",
      message: "Event banner is required",
    });
    isValid = false;
  }

  if (!data.sections || data.sections.length === 0) {
    setError("sections", {
      type: "manual",
      message: "At least one section must be selected",
    });
    isValid = false;
  }

  // validate each section's data based on the selected sections
  const sections: string[] = data.sections || [];

  if (
    sections.includes("video") &&
    (!data || !data.videoFile || !data.videoFile.length) &&
    mode === "add"
  ) {
    setError("videoFile", {
      type: "manual",
      message: "Video file is required",
    });
    isValid = false;
  }

  if (sections.includes("segments")) {
    if (!data.segmentsData || data.segmentsData.length === 0) {
      setError("segmentsData", {
        type: "manual",
        message: "At least one segment is required",
      });
      isValid = false;
    } else {
      for (let i = 0; i < data.segmentsData.length; i++) {
        if (
          !data.segmentsData[i].title ||
          data.segmentsData[i].title.trim() === ""
        ) {
          setError(`segmentsData.${i}.title`, {
            type: "manual",
            message: "Segment title is required",
          });
          isValid = false;
        }

        if (data.segmentsData[i].isPaidSegment) {
          const price = parseFloat(data.segmentsData[i].fees) || 0;
          if (price <= 0) {
            setError(`segmentsData.${i}.fees`, {
              type: "manual",
              message: "Fees must be greater than 0 for paid segments",
            });
            isValid = false;
          }

          if (
            !data.segmentsData[i].transactionPlatforms ||
            data.segmentsData[i].transactionPlatforms.length === 0
          ) {
            setError(`segmentsData.${i}.transactionPlatforms`, {
              type: "manual",
              message:
                "At least one transaction platform is required for paid segments",
            });
            isValid = false;
          }
        }

        if (
          !data.segmentsData[i].details ||
          data.segmentsData[i].details.trim() === ""
        ) {
          setError(`segmentsData.${i}.details`, {
            type: "manual",
            message: "Segment details are required",
          });
          isValid = false;
        }
      }
    }
  }

  if (sections.includes("experience")) {
    if (!data.experienceData || data.experienceData.length === 0) {
      setError("experienceData", {
        type: "manual",
        message: "At least one experience is required",
      });
      isValid = false;
    } else {
      for (let i = 0; i < data.experienceData.length; i++) {
        if (
          !data.experienceData[i].details ||
          data.experienceData[i].details.trim() === ""
        ) {
          setError(`experienceData.${i}.details`, {
            type: "manual",
            message: "Experience details are required",
          });
          isValid = false;
        }
      }
    }
  }

  if (sections.includes("schedule")) {
    if (!data.scheduleData || data.scheduleData.length === 0) {
      setError("scheduleData", {
        type: "manual",
        message: "At least one schedule item is required",
      });
      isValid = false;
    } else {
      for (let i = 0; i < data.scheduleData.length; i++) {
        if (!data.scheduleData[i].date) {
          setError(`scheduleData.${i}.date`, {
            type: "manual",
            message: "Schedule date is required",
          });
          isValid = false;
        }

        if (!data.scheduleData[i].fromTime) {
          setError(`scheduleData.${i}.fromTime`, {
            type: "manual",
            message: "Schedule start time is required",
          });
          isValid = false;
        }

        if (!data.scheduleData[i].toTime) {
          setError(`scheduleData.${i}.toTime`, {
            type: "manual",
            message: "Schedule end time is required",
          });
          isValid = false;
        }
      }
    }
  }

  if (sections.includes("sp")) {
    if (!data.spData || data.spData.length === 0) {
      setError("spData", {
        type: "manual",
        message: "At least one sponsor/partner is required",
      });
      isValid = false;
    } else {
      for (let i = 0; i < data.spData.length; i++) {
        if (
          (!data.spData[i].logoFile || !data.spData[i].logoFile.length) &&
          mode === "add"
        ) {
          setError(`spData.${i}.logoFile`, {
            type: "manual",
            message: "Logo file is required",
          });
          isValid = false;
        }
      }
    }
  }

  if (sections.includes("faqs")) {
    if (!data.faqData || data.faqData.length === 0) {
      setError("faqData", {
        type: "manual",
        message: "At least one FAQ item is required",
      });
      isValid = false;
    } else {
      for (let i = 0; i < data.faqData.length; i++) {
        if (
          !data.faqData[i].question ||
          data.faqData[i].question.trim() === ""
        ) {
          setError(`faqData.${i}.question`, {
            type: "manual",
            message: "FAQ question is required",
          });
          isValid = false;
        }
        if (!data.faqData[i].answer || data.faqData[i].answer.trim() === "") {
          setError(`faqData.${i}.answer`, {
            type: "manual",
            message: "FAQ answer is required",
          });
          isValid = false;
        }
      }
    }
  }

  if (data.hasCAForm) {
    if (!data.caFormData || !data.caFormData.title) {
      setError("caFormData.title", {
        type: "manual",
        message: "CA form title is required",
      });
      isValid = false;
    }

    if (!data.caFormData || !data.caFormData.details) {
      setError("caFormData.details", {
        type: "manual",
        message: "CA form details are required",
      });
      isValid = false;
    }

    if (!data.caFormData || !data.caFormData.applicationDeadline) {
      setError("caFormData.applicationDeadline", {
        type: "manual",
        message: "CA form application deadline is required",
      });
      isValid = false;
    }
  }

  // filter the data
  const { filteredData } = useFilterEventForm({ data, sections, mode });

  return { filteredData, isValid };
}
