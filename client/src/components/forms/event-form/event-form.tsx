import { Activity, useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import FormLayout from "./form-layout";
import { sectionsData, sectionsTitle } from "@/services/data/event-form-data";
import SectionsSelect from "./fields/select/sections-select";
import AboutSectionFields from "./fields/about-section-fields";
import BasicInfoFields from "./fields/basic-info-fields";
import VideoSectionFields from "./fields/video-section-fields";
import HeroSectionFields from "./fields/hero-section-fields";
import SegmentsSectionFields from "./fields/segments-section-fields";
import ExperiencesFields from "./fields/experiences-fields";
import ScheduleSectionFields from "./fields/schedule-section-fields";
import FaqSectionFields from "./fields/faq-section-fields";
import SpSectionFields from "./fields/sp-section-fields";
import CAApplicationFields from "./fields/ca-application-fields";
import RegistrationFormFields from "./fields/registration-form-fields/registration-form-fields";
import ContactInfoFields from "./fields/contact-info-fields";
import FormSectionLayout from "./form-section-layout/form-section-layout";
import useEventFormValidator from "@/hooks/use-event-form-validator";
import { useMutation } from "@tanstack/react-query";
import type { EventFormDataType } from "@/types/event-types";
import { addEvent } from "@/lib/api/event";
import toast from "react-hot-toast";

export default function EventForm({
  defaultValues,
}: {
  defaultValues?: any;
}): ReactNode {
  const isEditMode = Boolean(defaultValues);

  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [filteredSections, setFilteredSections] = useState<string[]>([]);
  const [currentField, setCurrentField] = useState<string>("basic");
  const [currentNumber, setCurrentNumber] = useState<number>(1);
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);

  useEffect(() => {
    const filtered = sectionsData.sectionOptions.filter((section) =>
      selectedSections.includes(section),
    );
    setFilteredSections(filtered);
  }, [selectedSections]);

  function handleFieldChange(
    method: "next" | "previous" | "jump",
    jumpToField?: string,
  ) {
    const sections: string[] = ["basic", ...filteredSections, "final"];

    if (method === "jump" && jumpToField) {
      setCurrentField(jumpToField);
      setCurrentNumber(sections.indexOf(jumpToField) + 1);
    }

    const currentIndex: number = sections.indexOf(currentField);

    if (method === "next") {
      setCurrentField(sections[currentIndex + 1]);
      setCurrentNumber(currentIndex + 2);
    } else if (method === "previous") {
      setCurrentField(sections[currentIndex - 1]);
      setCurrentNumber(currentIndex);
    }
  }

  const eventMutation = useMutation({
    mutationFn: (data: EventFormDataType) => {
      return addEvent(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Event updated successfully!"
          : "Event created successfully!",
      );
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
    control,
    clearErrors,
  } = useForm({
    defaultValues: defaultValues || {},
  });

  function onSubmit(data: any) {
    setValue("hiddenSections", hiddenSections);
    const { filteredData, isValid } = useEventFormValidator({
      data,
      setError,
      clearErrors,
    });
    if (!isValid) return;

    if (isEditMode) {
      // Handle edit event logic
      eventMutation.mutate(data);
    } else {
      // Handle add event logic
      eventMutation.mutate(filteredData);
    }
  }

  const totalSections = selectedSections.length + 2;
  const sectionTitle: string =
    currentField === "basic" && isEditMode
      ? "Edit Event Details"
      : sectionsTitle[currentField];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex flex-col gap-7 max-w-[min(var(--container-4xl),var(--max-elements-width))] mx-auto"
    >
      <FormSectionLayout
        title={sectionTitle}
        currentField={currentField}
        handleFieldChange={handleFieldChange}
        isEditMode={isEditMode}
        totalSections={totalSections}
        currentNumber={currentNumber}
        errors={errors}
        sections={filteredSections}
        hiddenSections={hiddenSections}
        setHiddenSections={setHiddenSections}
      >
        <Activity mode={currentField === "basic" ? "visible" : "hidden"}>
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

              {errors.sections && (
                <p className="text-red-600 text-sm">
                  {errors.sections.message as string}
                </p>
              )}
            </div>
          </FormLayout>
        </Activity>

        {/* website hero section form fields */}
        <Activity mode={currentField === "hero" ? "visible" : "hidden"}>
          <HeroSectionFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("hero")}
          />
        </Activity>

        {/* website video section form fields */}
        <Activity mode={currentField === "video" ? "visible" : "hidden"}>
          <VideoSectionFields register={register} errors={errors} />
        </Activity>

        {/* website about section form fields */}
        <Activity mode={currentField === "about" ? "visible" : "hidden"}>
          <AboutSectionFields
            register={register}
            errors={errors}
            isSectionSelected={selectedSections.includes("about")}
          />
        </Activity>

        {/* website segments section form fields */}
        <Activity mode={currentField === "segments" ? "visible" : "hidden"}>
          <SegmentsSectionFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("segments")}
            getValues={getValues}
          />
        </Activity>

        {/* website experiences section form fields */}
        <Activity mode={currentField === "experiences" ? "visible" : "hidden"}>
          <ExperiencesFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("experiences")}
            getValues={getValues}
          />
        </Activity>

        {/* website schedule section form fields */}
        <Activity mode={currentField === "schedule" ? "visible" : "hidden"}>
          <ScheduleSectionFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("schedule")}
          />
        </Activity>

        {/* website sponsors & partners section form fields */}
        <Activity mode={currentField === "sp" ? "visible" : "hidden"}>
          <SpSectionFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("sp")}
          />
        </Activity>

        {/* website faq section form fields */}
        <Activity mode={currentField === "faqs" ? "visible" : "hidden"}>
          <FaqSectionFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("faqs")}
          />
        </Activity>

        <Activity mode={currentField === "final" ? "visible" : "hidden"}>
          {/* website contact info section form fields */}
          <ContactInfoFields
            register={register}
            control={control}
            errors={errors}
          />

          {/* website registration form fields */}
          <RegistrationFormFields
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
          />

          {/* website CA Application form fields */}
          <CAApplicationFields
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
          />
        </Activity>
      </FormSectionLayout>
    </form>
  );
}
