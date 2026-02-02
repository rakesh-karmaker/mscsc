import { Activity, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import FormLayout from "./form-layout";
import { sectionsData } from "@/services/data/event-form-data";
import SectionsSelect from "./fields/select/sections-select";
import AboutSectionFields from "./fields/about-section-fields";
import BasicInfoFields from "./fields/basic-info-fields";
import VideoSectionFields from "./fields/video-section-fields";
import HeroSectionFields from "./fields/hero-section-fields";
import SegmentsSectionFields from "./fields/segments-section-fields";
import ExperiencesFields from "./fields/experiences-fields";
import ScheduleSectionFields from "./fields/schedule-section-fields";
import FaqSectionFields from "./fields/faq-section-fields";
import FormSubmitBtn from "@/components/ui/form-submit-btn";
import SpSectionFields from "./fields/sp-section-fields";
import CAApplicationFields from "./fields/ca-application-fields";
import RegistrationFormFields from "./fields/registration-form-fields/registration-form-fields";

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
    // setError,
    setValue,
    // getValues,
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex flex-col gap-7 max-w-[min(var(--container-4xl),var(--max-elements-width))] mx-auto"
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
          control={control}
          errors={errors}
        />
      </Activity>

      {/* website video section form fields */}
      <Activity
        mode={selectedSections.includes("video") ? "visible" : "hidden"}
      >
        <VideoSectionFields register={register} errors={errors} />
      </Activity>

      {/* website about section form fields */}
      <Activity
        mode={selectedSections.includes("about") ? "visible" : "hidden"}
      >
        <AboutSectionFields register={register} errors={errors} />
      </Activity>

      {/* website segments section form fields */}
      <Activity
        mode={selectedSections.includes("segments") ? "visible" : "hidden"}
      >
        <SegmentsSectionFields
          register={register}
          control={control}
          errors={errors}
        />
      </Activity>

      {/* website experiences section form fields */}
      <Activity
        mode={selectedSections.includes("experiences") ? "visible" : "hidden"}
      >
        <ExperiencesFields
          register={register}
          control={control}
          errors={errors}
        />
      </Activity>

      {/* website schedule section form fields */}
      <Activity
        mode={selectedSections.includes("schedule") ? "visible" : "hidden"}
      >
        <ScheduleSectionFields
          register={register}
          control={control}
          errors={errors}
        />
      </Activity>

      {/* website sponsors & partners section form fields */}
      <Activity mode={selectedSections.includes("sp") ? "visible" : "hidden"}>
        <SpSectionFields
          register={register}
          control={control}
          errors={errors}
        />
      </Activity>

      {/* website faq section form fields */}
      <Activity mode={selectedSections.includes("faqs") ? "visible" : "hidden"}>
        <FaqSectionFields
          register={register}
          control={control}
          errors={errors}
        />
      </Activity>

      {/* website registration form fields */}
      <RegistrationFormFields
        register={register}
        errors={errors}
        setValue={setValue}
      />

      {/* website CA Application form fields */}
      <CAApplicationFields
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
      />

      <FormSubmitBtn
        isLoading={false}
        pendingText={isEditMode ? "Updating Event..." : "Creating Event..."}
        className="w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit!"
      >
        {isEditMode ? "Update Event" : "Create Event"}
      </FormSubmitBtn>
    </form>
  );
}
