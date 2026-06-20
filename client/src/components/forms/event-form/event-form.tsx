import { useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import FormLayout from "./form-layout";
import { sectionsData, sectionsTitle } from "@/services/data/event-form-data";
import SectionsSelect from "./fields/select/sections-select";
import AboutSectionFields from "./fields/about-section-fields";
import BasicInfoFields from "./fields/basic-info-fields";
import VideoSectionFields from "./fields/video-section-fields";
import HeroSectionFields from "./fields/hero-section-fields";
import SegmentsSectionFields from "./fields/segments-section-fields/segments-section-fields";
import ScheduleSectionFields from "./fields/schedule-section-fields/schedule-section-fields";
import FaqSectionFields from "./fields/faq-section-fields/faq-section-fields";
import SpSectionFields from "./fields/sp-section-fields/sp-section-fields";
import CAApplicationFields from "./fields/ca-application-fields";
import RegistrationFormFields from "./fields/registration-form-fields/registration-form-fields";
import ContactInfoFields from "./fields/contact-info-fields";
import FormSectionLayout from "./form-section-layout/form-section-layout";
import useEventFormValidator from "@/hooks/use-event-form-validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  EventFormDataType,
  FilteredEventDataType,
} from "@/types/event/event-types";
import { addEvent, editEvent } from "@/lib/api/event/event";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ExperiencesFields from "./fields/experiences-section-fields/experiences-fields";

export default function EventForm({
  defaultValues,
}: {
  defaultValues?: FilteredEventDataType;
}): ReactNode {
  const isEditMode = Boolean(defaultValues);
  const eventSlug = useParams().eventSlug || "";
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [selectedSections, setSelectedSections] = useState<string[]>(
    defaultValues?.sections || [],
  );
  const [currentField, setCurrentField] = useState<string>("basic");
  const [currentNumber, setCurrentNumber] = useState<number>(1);
  const [hiddenSections, setHiddenSections] = useState<string[]>(
    defaultValues?.hiddenSections || [],
  );

  const filteredSections = useMemo(
    () =>
      sectionsData.sectionOptions.filter((section) =>
        selectedSections.includes(section),
      ),
    [selectedSections],
  );

  function handleFieldChange(
    method: "next" | "previous" | "jump",
    jumpToField?: string,
  ) {
    const sections: string[] = [
      "basic",
      ...filteredSections.filter((s) => s != "contact"),
      "final",
    ];

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
    mutationFn: ({
      method,
      data,
    }: {
      method: "add" | "edit";
      data: EventFormDataType;
    }) => {
      if (method === "edit") {
        return editEvent(eventSlug, data);
      } else {
        return addEvent(data);
      }
    },
    onSuccess: (res) => {
      toast.success(
        isEditMode
          ? "Event updated successfully!"
          : "Event created successfully!",
      );
      queryClient.invalidateQueries({
        queryKey: ["eventData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["event"],
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      const slug = res.data.eventSlug;
      navigate(`/admin/event/${slug}/`);
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
    defaultValues: defaultValues || ({} as any),
  });

  function onSubmit(data: any) {
    data.hiddenSections = hiddenSections;
    if (isEditMode) {
      data.sections = selectedSections;
    }
    const { filteredData, isValid } = useEventFormValidator({
      data,
      setError,
      clearErrors,
      isEditMode,
    });
    if (!isValid) return;

    if (isEditMode) {
      // Handle edit event logic
      eventMutation.mutate({
        method: "edit",
        data: filteredData,
      });
    } else {
      // Handle add event logic
      eventMutation.mutate({
        method: "add",
        data: filteredData,
      });
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
        isLoading={eventMutation.isPending}
      >
        {currentField === "basic" && (
          <>
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
              id="sections-selection"
            >
              <div className="flex flex-col gap-6">
                <SectionsSelect
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
          </>
        )}

        {/* website hero section form fields */}
        {currentField === "hero" && (
          <HeroSectionFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("hero")}
            defaultIcons={defaultValues?.heroData?.icons || []}
          />
        )}

        {/* website video section form fields */}
        {currentField === "video" && (
          <VideoSectionFields
            register={register}
            errors={errors}
            isSectionSelected={selectedSections.includes("video")}
          />
        )}

        {/* website about section form fields */}
        {currentField === "about" && (
          <AboutSectionFields
            register={register}
            errors={errors}
            isSectionSelected={selectedSections.includes("about")}
          />
        )}

        {/* website segments section form fields */}
        {currentField === "segments" && (
          <SegmentsSectionFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("segments")}
            getValues={getValues}
            setValue={setValue}
            clearErrors={clearErrors}
          />
        )}

        {/* website experiences section form fields */}
        {currentField === "experiences" && (
          <ExperiencesFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("experiences")}
            getValues={getValues}
          />
        )}

        {/* website schedule section form fields */}
        {currentField === "schedule" && (
          <ScheduleSectionFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("schedule")}
          />
        )}

        {/* website sponsors & partners section form fields */}
        {currentField === "sp" && (
          <SpSectionFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("sp")}
          />
        )}

        {/* website faq section form fields */}
        {currentField === "faqs" && (
          <FaqSectionFields
            register={register}
            control={control}
            errors={errors}
            isSectionSelected={selectedSections.includes("faqs")}
          />
        )}

        {currentField === "final" && (
          <>
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
          </>
        )}
      </FormSectionLayout>
    </form>
  );
}
