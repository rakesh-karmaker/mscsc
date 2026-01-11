import { useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../form-layout";
import { TextField } from "@mui/material";

type FaqSectionFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
};

export default function FaqSectionFields({
  register,
  control,
  errors,
}: FaqSectionFieldsProps): ReactNode {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "faq",
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
      <div className="w-full h-full flex flex-col gap-4">
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
          >
            <div className="w-full flex flex-col gap-4">
              <TextField
                fullWidth
                variant="outlined"
                {...register(`faq.${index}.question`)}
                label="Question"
                multiline
                error={Boolean(
                  errors.faq && errors.faq[index] && errors.faq[index].question
                )}
                helperText={
                  errors.faq &&
                  errors.faq[index] &&
                  errors.faq[index].question &&
                  (errors.faq[index].question.message as string)
                }
                placeholder="Enter the frequently asked question here."
              />

              <TextField
                fullWidth
                variant="outlined"
                {...register(`faq.${index}.answer`)}
                label="Answer"
                multiline
                minRows={4}
                error={Boolean(
                  errors.faq && errors.faq[index] && errors.faq[index].answer
                )}
                helperText={
                  errors.faq &&
                  errors.faq[index] &&
                  errors.faq[index].answer &&
                  (errors.faq[index].answer.message as string)
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
