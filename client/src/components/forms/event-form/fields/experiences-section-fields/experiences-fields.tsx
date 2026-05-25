import { useCallback, useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../../form-layout";
import ExperienceFields from "./experience-fields";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

const DEFAULT_EXPERIENCE = {
  icon: "games",
  title: "",
  details: "",
};

type ExperiencesFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
  getValues: (payload?: string | string[]) => Object;
};

export default function ExperiencesFields({
  register,
  control,
  errors,
  isSectionSelected,
  getValues,
}: ExperiencesFieldsProps): ReactNode {
  const { fields, append, remove, move } = useFieldArray({
    control: control,
    name: "experienceData",
  });

  const handleAppend = useCallback(() => {
    append(DEFAULT_EXPERIENCE);
  }, [append]);

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  useEffect(() => {
    if (fields.length === 0) {
      handleAppend();
    }
  }, [fields.length, handleAppend]);

  return (
    <FormLayout
      title={"Experiences"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          Define the different experiences such as workshops, talks, and
          activities that make up the event.
        </p>
      }
    >
      <div className="w-full h-full flex flex-col gap-0 max-sm:gap-3">
        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) return;
            const { source } = event.operation;

            if (isSortable(source)) {
              const { initialIndex, index } = source;
              if (initialIndex !== index) {
                move(initialIndex, index);
              }
            }
          }}
        >
          {fields.map((field, index) => (
            <ExperienceFields
              key={field.id}
              id={field.id}
              index={index}
              length={fields.length}
              field={field}
              handleRemove={handleRemove}
              control={control}
              errors={errors}
              isSectionSelected={isSectionSelected}
              getValues={getValues}
              register={register}
            />
          ))}
        </DragDropProvider>
        <div className="w-full flex gap-5 items-center flex-wrap">
          <button
            type="button"
            className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit!"
            onClick={() => handleAppend()}
          >
            Add Experience
          </button>
          {fields.length > 1 && (
            <button
              type="button"
              className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit! before:bg-red-500!"
              onClick={() => handleRemove(fields.length - 1)}
            >
              Remove Last Experience
            </button>
          )}
        </div>
      </div>
    </FormLayout>
  );
}
