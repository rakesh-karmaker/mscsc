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
import SpSectionFields from "./fields/sp-section-fields";
import CAApplicationFields from "./fields/ca-application-fields";
import RegistrationFormFields from "./fields/registration-form-fields/registration-form-fields";
import ContactInfoFields from "./fields/contact-info-fields";
import FormSectionLayout from "./form-section-layout";

export default function EventForm({
  defaultValues,
}: {
  defaultValues?: any;
}): ReactNode {
  const isEditMode = Boolean(defaultValues);

  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [currentField, setCurrentField] = useState<string>("basic");
  const [currentNumber, setCurrentNumber] = useState<number>(1);

  function handleFieldChange(method: "next" | "previous") {
    const sections: string[] = sectionsData.sectionOptions;
    const currentIndex: number = sections.indexOf(currentField);

    if (method === "next" && currentIndex === selectedSections.length - 1) {
      setCurrentField("final");
      setCurrentNumber(selectedSections.length + 2);
    } else if (method === "previous" && currentIndex === 0) {
      setCurrentField("basic");
      setCurrentNumber(1);
    } else if (method === "previous" && currentField === "final") {
      if (selectedSections.length === 0) {
        setCurrentField("basic");
        setCurrentNumber(1);
      } else {
        let newIndex: number = sections.length - 1;
        while (!selectedSections.includes(sections[newIndex])) {
          newIndex--;
        }
        setCurrentField(sections[newIndex]);
        setCurrentNumber(newIndex + 2);
      }
    } else {
      let newIndex: number = currentIndex + (method === "next" ? 1 : -1);
      while (!selectedSections.includes(sections[newIndex])) {
        newIndex = method === "next" ? newIndex + 1 : newIndex - 1;
      }
      setCurrentField(sections[newIndex]);
      setCurrentNumber(newIndex + 2);
    }
  }

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
    console.log("Form Data:", JSON.stringify(data));
    if (isEditMode) {
      // Handle edit event logic
    } else {
      // Handle add event logic
    }
  }

  const totalSections = selectedSections.length + 2;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex flex-col gap-7 max-w-[min(var(--container-4xl),var(--max-elements-width))] mx-auto"
    >
      <Activity mode={currentField === "basic" ? "visible" : "hidden"}>
        <FormSectionLayout
          title={`${isEditMode ? "Edit Event Details" : "Create New Event"}`}
          currentField={currentField}
          handleFieldChange={handleFieldChange}
          isEditMode={isEditMode}
          totalSections={totalSections}
          currentNumber={currentNumber}
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
        </FormSectionLayout>
      </Activity>

      {/* website hero section form fields */}
      <Activity mode={currentField === "hero" ? "visible" : "hidden"}>
        <FormSectionLayout
          title="Website Hero Section"
          currentField={currentField}
          handleFieldChange={handleFieldChange}
          isEditMode={isEditMode}
          totalSections={totalSections}
          currentNumber={currentNumber}
        >
          <HeroSectionFields
            register={register}
            control={control}
            errors={errors}
          />
        </FormSectionLayout>
      </Activity>

      {/* website video section form fields */}
      <Activity mode={currentField === "video" ? "visible" : "hidden"}>
        <FormSectionLayout
          title="Website Video Section"
          currentField={currentField}
          handleFieldChange={handleFieldChange}
          isEditMode={isEditMode}
          totalSections={totalSections}
          currentNumber={currentNumber}
        >
          <VideoSectionFields register={register} errors={errors} />
        </FormSectionLayout>
      </Activity>

      {/* website about section form fields */}
      <Activity mode={currentField === "about" ? "visible" : "hidden"}>
        <FormSectionLayout
          title="Website About Section"
          currentField={currentField}
          handleFieldChange={handleFieldChange}
          isEditMode={isEditMode}
          totalSections={totalSections}
          currentNumber={currentNumber}
        >
          <AboutSectionFields register={register} errors={errors} />
        </FormSectionLayout>
      </Activity>

      {/* website segments section form fields */}
      <Activity mode={currentField === "segments" ? "visible" : "hidden"}>
        <FormSectionLayout
          title="Website Segments Section"
          currentField={currentField}
          handleFieldChange={handleFieldChange}
          isEditMode={isEditMode}
          totalSections={totalSections}
          currentNumber={currentNumber}
        >
          <SegmentsSectionFields
            register={register}
            control={control}
            errors={errors}
          />
        </FormSectionLayout>
      </Activity>

      {/* website experiences section form fields */}
      <Activity mode={currentField === "experiences" ? "visible" : "hidden"}>
        <FormSectionLayout
          title="Website Experiences Section"
          currentField={currentField}
          handleFieldChange={handleFieldChange}
          isEditMode={isEditMode}
          totalSections={totalSections}
          currentNumber={currentNumber}
        >
          <ExperiencesFields
            register={register}
            control={control}
            errors={errors}
          />
        </FormSectionLayout>
      </Activity>

      {/* website schedule section form fields */}
      <Activity mode={currentField === "schedule" ? "visible" : "hidden"}>
        <FormSectionLayout
          title="Website Schedule Section"
          currentField={currentField}
          handleFieldChange={handleFieldChange}
          isEditMode={isEditMode}
          totalSections={totalSections}
          currentNumber={currentNumber}
        >
          <ScheduleSectionFields
            register={register}
            control={control}
            errors={errors}
          />
        </FormSectionLayout>
      </Activity>

      {/* website sponsors & partners section form fields */}
      <Activity mode={currentField === "sp" ? "visible" : "hidden"}>
        <FormSectionLayout
          title="Website Sponsors & Partners Section"
          currentField={currentField}
          handleFieldChange={handleFieldChange}
          isEditMode={isEditMode}
          totalSections={totalSections}
          currentNumber={currentNumber}
        >
          <SpSectionFields
            register={register}
            control={control}
            errors={errors}
          />
        </FormSectionLayout>
      </Activity>

      {/* website faq section form fields */}
      <Activity mode={currentField === "faqs" ? "visible" : "hidden"}>
        <FormSectionLayout
          title="Website FAQ Section"
          currentField={currentField}
          handleFieldChange={handleFieldChange}
          isEditMode={isEditMode}
          totalSections={totalSections}
          currentNumber={currentNumber}
        >
          <FaqSectionFields
            register={register}
            control={control}
            errors={errors}
          />
        </FormSectionLayout>
      </Activity>

      <Activity mode={currentField === "final" ? "visible" : "hidden"}>
        <FormSectionLayout
          title="Contact Info & Forms"
          currentField={currentField}
          handleFieldChange={handleFieldChange}
          isEditMode={isEditMode}
          totalSections={totalSections}
          currentNumber={currentNumber}
        >
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
          />

          {/* website CA Application form fields */}
          <CAApplicationFields
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
          />
        </FormSectionLayout>
      </Activity>
    </form>
  );
}
