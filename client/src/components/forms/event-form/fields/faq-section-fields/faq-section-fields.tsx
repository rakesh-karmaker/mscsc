import { useCallback, useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../../form-layout";
import FaqFields from "./faq-fields";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

const DEFAULT_FAQ_ITEM = {
  question: "",
  answer: "",
};

type FaqSectionFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
};

export default function FaqSectionFields({
  register,
  control,
  errors,
  isSectionSelected,
}: FaqSectionFieldsProps): ReactNode {
  const { fields, append, remove, move } = useFieldArray({
    control: control,
    name: "faqData",
  });

  const handleAppend = useCallback(() => {
    append(DEFAULT_FAQ_ITEM);
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
      title={"FAQ Section"}
      description={
        <p className="w-full  h-full">
          The FAQ (Frequently Asked Questions) section provides answers to
          common questions that attendees or participants may have about the
          event.
        </p>
      }
      id="faq-section"
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
            <FaqFields
              key={field.id}
              id={field.id}
              index={index}
              field={field}
              handleRemove={handleRemove}
              register={register}
              errors={errors}
              length={fields.length}
              isSectionSelected={isSectionSelected}
              control={control}
            />
          ))}
        </DragDropProvider>
        <div className="w-full flex gap-5 items-center flex-wrap">
          <button
            type="button"
            className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit!"
            onClick={() => handleAppend()}
          >
            Add Question
          </button>
          {fields.length > 1 && (
            <button
              type="button"
              className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit! before:bg-red-500!"
              onClick={() => handleRemove(fields.length - 1)}
            >
              Remove Last Question
            </button>
          )}
        </div>
      </div>
    </FormLayout>
  );
}
