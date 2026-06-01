import { useState, type ReactNode } from "react";
import { useWatch, type Control } from "react-hook-form";
import FormLayout from "../../form-layout";
import { TextField } from "@mui/material";
import { useSortable } from "@dnd-kit/react/sortable";
import LuArrowDown from "~icons/lucide/arrow-down";
import LuArrowUp from "~icons/lucide/arrow-up";
import LuGripVertical from "~icons/lucide/grip-vertical";

export default function FaqFields({
  id,
  length,
  field,
  index,
  handleRemove,
  control,
  errors,
  isSectionSelected,
  register,
}: {
  id: string;
  length: number;
  field: Record<"id", string>;
  index: number;
  handleRemove: (index: number) => void;
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
  register: any;
}): ReactNode {
  const { ref, handleRef } = useSortable({ id: id, index });

  const title =
    (useWatch({
      control,
      name: `faqData.${index}.question`,
    }) as string) || "";
  const [isOpen, setIsOpen] = useState<boolean>(title ? false : true);

  return (
    <div ref={ref}>
      <FormLayout
        dragger={
          <div ref={handleRef} className="cursor-move">
            <LuGripVertical className="cursor-grab touch-none select-none text-xl min-w-5" />
          </div>
        }
        key={field.id}
        title={
          <p className="line-clamp-1">{title || `FAQ Item ${index + 1}`}</p>
        }
        description={
          <p className="w-full min-w-[30ch] h-full">
            Details for FAQ item {index + 1}.
          </p>
        }
        textSize="lg"
        fontWeight="medium"
        cancelButton={
          <div className="w-fit flex items-center gap-2">
            <button
              type="button"
              className="primary-button before:bg-red-500! w-fit! min-w-fit! px-3! py-1.5! text-base! font-normal! h-fit! transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleRemove(index)}
              disabled={length <= 1}
            >
              Remove
            </button>
            <button
              type="button"
              className="primary-button before:bg-highlighted-color! w-fit! min-w-fit! px-3! py-1.5! text-xl! font-normal! h-9! transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <LuArrowUp /> : <LuArrowDown />}
            </button>
          </div>
        }
      >
        <div
          className="w-full h-fit overflow-hidden grid gap-5 transition-all duration-300"
          style={{
            gridTemplateColumns: "1fr",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
          }}
        >
          <div className="w-full flex flex-col gap-5 overflow-hidden">
            <div />
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
            <div className="pb-5!" />
          </div>
        </div>
      </FormLayout>
    </div>
  );
}
