import { Activity, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import FormLayout from "./form-layout";
import { sectionsData } from "@/services/data/event-form-data";
import { Button, Stack, styled, TextField, Tooltip } from "@mui/material";
import HeroIconsSelect from "./fields/select/hero-icons-select";
import SectionsSelect from "./fields/select/sections-select";
import { IoMdCloudUpload } from "react-icons/io";
import AboutSectionFields from "./fields/about-section-fields";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import BasicInfoFields from "./fields/basic-info-fields";
import VideoSectionFields from "./fields/video-section-fields";
import HeroSectionFields from "./fields/hero-section-fields";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";
import SegmentsSectionFields from "./fields/segments-section-fields";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
    control,
  } = useForm({
    defaultValues: defaultValues || {},
  });

  function onSubmit(data: any) {
    console.log("Form Data:", data);
    if (isEditMode) {
      // Handle edit event logic
    } else {
      // Handle add event logic
    }
  }

  console.log(errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex flex-col gap-7 max-w-4xl"
    >
      {/* event basic info fields */}
      <BasicInfoFields
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        defaultValues={defaultValues}
      />

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
        <HeroSectionFields
          register={register}
          setValue={setValue}
          errors={errors}
          getValues={getValues}
        />
      </Activity>

      {/* website video section form fields */}
      <Activity
        mode={selectedSections.includes("video") ? "visible" : "hidden"}
      >
        <VideoSectionFields setValue={setValue} errors={errors} />
      </Activity>

      {/* website about section form fields */}
      <Activity
        mode={selectedSections.includes("about") ? "visible" : "hidden"}
      >
        <AboutSectionFields
          register={register}
          setValue={setValue}
          errors={errors}
        />
      </Activity>

      {/* website segments section form fields */}
      <Activity
        mode={selectedSections.includes("segments") ? "visible" : "hidden"}
      >
        <SegmentsSectionFields
          register={register}
          control={control}
          getValues={getValues}
          errors={errors}
        />
      </Activity>

      <Button type="submit" variant="contained" className="max-w-fit">
        {isEditMode ? "Update Event" : "Create Event"}
      </Button>
    </form>
  );
}
