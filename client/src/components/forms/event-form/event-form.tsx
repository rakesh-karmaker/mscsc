import { Activity, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import FormLayout from "./form-layout";
import { sectionsData } from "@/services/data/event-form-data";
import { Button, styled, TextField } from "@mui/material";
import HeroIconsSelect from "./select/hero-icons-select";
import SectionsSelect from "./select/sections-select";
import { IoMdCloudUpload } from "react-icons/io";
import AboutSectionForm from "./about-section-form";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function EventForm({
  defaultValues,
}: {
  defaultValues?: any;
}): ReactNode {
  const isEditMode = Boolean(defaultValues);

  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [hasVideoSelected, setHasVideoSelected] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
  } = useForm({
    defaultValues: defaultValues || {},
  });

  function onSubmit(data: any) {
    if (isEditMode) {
      // Handle edit event logic
    } else {
      // Handle add event logic
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex flex-col gap-7 "
    >
      {/* website section selection */}
      <FormLayout
        title={sectionsData.title}
        description={sectionsData.description}
      >
        <div className="flex flex-col gap-6">
          <SectionsSelect
            register={register}
            setValue={setValue}
            selectedSections={selectedSections}
            setSelectedSections={setSelectedSections}
          />

          {errors.segments && (
            <p className="text-red-600 text-sm">
              {errors.segments.message as string}
            </p>
          )}
        </div>
      </FormLayout>

      {/* website hero section form fields */}
      <Activity mode={selectedSections.includes("hero") ? "visible" : "hidden"}>
        <FormLayout
          title={"Hero Section"}
          description={
            <p className="w-full min-w-[30ch] h-full">
              The hero section is the first section of the event page. It
              typically contains the event title, date, and a call-to-action
              button.
            </p>
          }
        >
          <div className="w-full h-full flex gap-4 max-md:flex-col">
            <div className="w-full flex flex-col gap-4">
              <TextField
                fullWidth
                variant="outlined"
                {...register("heroHeading", {
                  required: "Heading is required",
                  maxLength: {
                    value: 60,
                    message: "Heading cannot exceed 60 characters",
                  },
                })}
                label="Hero Heading"
                error={Boolean(errors.heroHeading)}
                helperText={errors.heroHeading?.message as string}
              />

              <TextField
                fullWidth
                variant="outlined"
                {...register("heroText", {
                  required: "Text is required",
                })}
                multiline
                minRows={5}
                label="Hero Text"
                error={Boolean(errors.heroText)}
                helperText={errors.heroText?.message as string}
              />
            </div>
            <HeroIconsSelect setValue={setValue} getValues={getValues} />
          </div>
        </FormLayout>
      </Activity>

      {/* website video section form fields */}
      <Activity
        mode={selectedSections.includes("video") ? "visible" : "hidden"}
      >
        <FormLayout
          title={"Video Section"}
          description={
            <p className="w-full min-w-[30ch] h-full">
              The video section showcases a promotional or informational video
              about the event. It helps to engage visitors and provide them with
              more context about the event.
            </p>
          }
        >
          <div className="flex flex-col gap-3">
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<IoMdCloudUpload />}
              className="max-w-fit"
            >
              {hasVideoSelected ? "Video Selected" : "Upload Video"}
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => {
                  setValue("videoFile", event.target.files);
                  setHasVideoSelected(
                    Boolean(event.target.files && event.target.files.length > 0)
                  );
                }}
                accept="video/*"
              />
            </Button>
            {errors.videoFile && (
              <p className="text-red-600 text-sm">
                {errors.videoFile.message as string}
              </p>
            )}
          </div>
        </FormLayout>
      </Activity>

      {/* website about section form fields */}
      <Activity
        mode={selectedSections.includes("about") ? "visible" : "hidden"}
      >
        <AboutSectionForm
          register={register}
          setValue={setValue}
          errors={errors}
        />
      </Activity>
    </form>
  );
}
