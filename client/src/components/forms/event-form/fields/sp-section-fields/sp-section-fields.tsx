import { useCallback, useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../../form-layout";
import SPFields from "./sp-fields";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

const DEFAULT_SP_ITEM = {
  name: "",
  logoFile: "",
  websiteUrl: "",
  logoPublicId: "",
};

type SpSectionFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
};

export default function SpSectionFields({
  register,
  control,
  errors,
  isSectionSelected,
}: SpSectionFieldsProps): ReactNode {
  const { fields, append, remove, move } = useFieldArray({
    control: control,
    name: "spData",
  });

  const handleAppend = useCallback(() => {
    append(DEFAULT_SP_ITEM);
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
      title={"Sponsors & Partners Section"}
      description={
        <p className="w-full  h-full">
          The sponsors & partners section highlights the organizations that
          support the event, showcasing their logos and providing links to their
          websites.
        </p>
      }
      id="sponsors-partners-section"
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
            <SPFields
              key={field.id}
              id={field.id}
              index={index}
              field={field}
              length={fields.length}
              handleRemove={handleRemove}
              control={control}
              register={register}
              errors={errors}
              isSectionSelected={isSectionSelected}
            />
          ))}
        </DragDropProvider>
        <div className="w-full flex gap-5 items-center flex-wrap">
          <button
            type="button"
            className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit!"
            onClick={() => handleAppend()}
          >
            Add Sponsor/Partner
          </button>
          {fields.length > 1 && (
            <button
              type="button"
              className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit! before:bg-red-500!"
              onClick={() => handleRemove(fields.length - 1)}
            >
              Remove Last Item
            </button>
          )}
        </div>
      </div>
    </FormLayout>
  );
}
