import { useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../form-layout";
import { TextField, Tooltip } from "@mui/material";

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
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "faqData",
  });

  function handleAppend() {
    append({
      question: "",
      answer: "",
    });
  }

  function handleRemove(index: number) {
    remove(index);
  }

  useEffect(() => {
    if (fields.length === 0) {
      handleAppend();
    }
  }, [fields, append]);
  return (
    <FormLayout
      title={"FAQ Section"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          The FAQ (Frequently Asked Questions) section provides answers to
          common questions that attendees or participants may have about the
          event.
        </p>
      }
    >
      <div className="w-full h-full flex flex-col gap-10">
        {fields.map((field, index) => (
          <FormLayout
            key={field.id}
            title={`Question ${index + 1}`}
            description={
              <p className="w-full min-w-[30ch] h-full">
                Question {index + 1}.
              </p>
            }
            textSize="lg"
            fontWeight="medium"
            cancelButton={
              <Tooltip title="Remove Question" placement="top" arrow>
                <span>
                  <button
                    type="button"
                    className="primary-button before:bg-red-500! w-fit! min-w-fit! px-3! py-1.5! text-base! font-normal! h-fit! transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleRemove(index)}
                    disabled={fields.length <= 1}
                  >
                    Remove
                  </button>
                </span>
              </Tooltip>
            }
          >
            <div className="w-full flex flex-col gap-4">
              <TextField
                fullWidth
                variant="outlined"
                {...register(`faqData.${index}.question`, {
                  required: isSectionSelected ? "Question is required" : false,
                })}
                label="Question"
                multiline
                error={Boolean(
                  errors.faqData &&
                  errors.faqData[index] &&
                  errors.faqData[index].question,
                )}
                helperText={
                  errors.faqData &&
                  errors.faqData[index] &&
                  errors.faqData[index].question &&
                  (errors.faqData[index].question.message as string)
                }
                placeholder="Enter the frequently asked question here."
              />

              <TextField
                fullWidth
                variant="outlined"
                {...register(`faqData.${index}.answer`, {
                  required: isSectionSelected ? "Answer is required" : false,
                })}
                label="Answer"
                multiline
                minRows={4}
                error={Boolean(
                  errors.faqData &&
                  errors.faqData[index] &&
                  errors.faqData[index].answer,
                )}
                helperText={
                  errors.faqData &&
                  errors.faqData[index] &&
                  errors.faqData[index].answer &&
                  (errors.faqData[index].answer.message as string)
                }
                placeholder="Provide a detailed answer to the question."
              />
            </div>
          </FormLayout>
        ))}
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
