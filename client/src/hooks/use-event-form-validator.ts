type useEventFormValidatorProps = {
  data: any;
  setError: any;
};

export default function useEventFormValidator({
  data,
  setError,
}: useEventFormValidatorProps): { filteredData: any; isValid: boolean } {
  const filteredData: any = {};
  let isValid: boolean = true;

  // validate the form's basic data
  if (!data.eventDate) {
    setError("eventDate", {
      type: "manual",
      message: "Event date is required",
    });
    isValid = false;
  }

  if (!data.formData.registrationDeadline) {
    setError("registrationDeadline", {
      type: "manual",
      message: "Registration deadline is required",
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
  const sections: string[] = data.sections;

  if (
    sections.includes("video") &&
    (!data.videoData.videoFile || !data.videoData.videoFile.length)
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

  if (sections.includes("sp")) {
    if (!data.spData || !data.spData.length) {
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

  return { filteredData, isValid };
}
