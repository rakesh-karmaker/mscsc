import type { EventFormDataType } from "@/types/event-types";
import useFilterEventForm from "./use-filter-event-form";

type useEventFormValidatorProps = {
  data: any;
  setError: any;
  clearErrors?: any;
};

export default function useEventFormValidator({
  data,
  setError,
  clearErrors,
}: useEventFormValidatorProps): {
  filteredData: EventFormDataType;
  isValid: boolean;
} {
  let isValid: boolean = true;

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

  if (!data.eventLogo || !data.eventLogo.length) {
    setError("eventLogo", {
      type: "manual",
      message: "Event logo is required",
    });
    isValid = false;
  }

  if (!data.eventLogoFavicon || !data.eventLogoFavicon.length) {
    setError("eventLogoFavicon", {
      type: "manual",
      message: "Event favicon logo is required",
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
    (!data.videoData ||
      !data.videoData.videoFile ||
      !data.videoData.videoFile.length)
  ) {
    setError("videoData.videoFile", {
      type: "manual",
      message: "Video file is required",
    });
    isValid = false;
  }

  if (
    sections.includes("about") &&
    (!data.aboutImageFile || !data.aboutImageFile.length)
  ) {
    setError("aboutImageFile", {
      type: "manual",
      message: "About image is required",
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
        if (
          !data.scheduleData[i].date ||
          data.scheduleData[i].date.trim() === ""
        ) {
          setError(`scheduleData.${i}.date`, {
            type: "manual",
            message: "Schedule date is required",
          });
          isValid = false;
        }

        if (
          !data.scheduleData[i].fromTime ||
          data.scheduleData[i].fromTime.trim() === ""
        ) {
          setError(`scheduleData.${i}.fromTime`, {
            type: "manual",
            message: "Schedule start time is required",
          });
          isValid = false;
        }

        if (
          !data.scheduleData[i].toTime ||
          data.scheduleData[i].toTime.trim() === ""
        ) {
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
        if (!data.spData[i].logoFile || !data.spData[i].logoFile.length) {
          setError(`spData.${i}.logoFile`, {
            type: "manual",
            message: "Logo file is required",
          });
          isValid = false;
        }
      }
    }
  }

  // filter the data
  const { filteredData } = useFilterEventForm({ data, sections });

  return { filteredData, isValid };
}
