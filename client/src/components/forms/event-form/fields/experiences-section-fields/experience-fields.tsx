import { useState, type ReactNode } from "react";
import { useWatch, type Control } from "react-hook-form";
import FormLayout from "../../form-layout";
import { Stack, TextField } from "@mui/material";
import { icons } from "@/services/data/icons-data";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";
import SelectIconField from "@/components/ui/select-icon-field";
import { useSortable } from "@dnd-kit/react/sortable";
import LuArrowDown from "~icons/lucide/arrow-down";
import LuArrowUp from "~icons/lucide/arrow-up";
import LuGripVertical from "~icons/lucide/grip-vertical";

export default function ExperienceFields({
  id,
  length,
  field,
  index,
  handleRemove,
  control,
  errors,
  isSectionSelected,
  getValues,
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
  getValues: (payload?: string | string[]) => Object;
  register: any;
}): ReactNode {
  const { ref, handleRef } = useSortable({ id: id, index });

  const title =
    (useWatch({
      control,
      name: `experienceData.${index}.title`,
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
          <p className="line-clamp-1">{title || `Experience ${index + 1}`}</p>
        }
        description={
          <p className="w-full  h-full">Details for experience {index + 1}.</p>
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
        id={`experience-${index}`}
      >
        <div
          className="w-full h-fit overflow-hidden grid gap-5 transition-all duration-300"
          style={{
            gridTemplateColumns: "1fr",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
          }}
        >
          <div className="w-full flex flex-col gap-5 overflow-hidden">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
              className="pt-5!"
            >
              <TextField
                fullWidth
                variant="outlined"
                {...register(`experienceData.${index}.title`, {
                  required: isSectionSelected
                    ? "Experience title is required"
                    : false,
                  maxLength: {
                    value: 100,
                    message: "Title cannot exceed 100 characters",
                  },
                })}
                label="Experience Title"
                error={Boolean(
                  errors.experienceData &&
                  errors.experienceData[index] &&
                  errors.experienceData[index].title,
                )}
                helperText={
                  errors.experienceData &&
                  errors.experienceData[index] &&
                  errors.experienceData[index].title &&
                  (errors.experienceData[index].title.message as string)
                }
              />

              <SelectIconField
                id={`experienceData-icon-${index}`}
                name={`experienceData.${index}.icon`}
                icons={icons}
                control={control}
                hasErrors={Boolean(errors?.experienceData?.[index]?.icon)}
                errorMessage={
                  errors.experienceData?.[index]?.icon?.message as string
                }
                defaultValue="games"
              >
                Experience Icon
              </SelectIconField>
            </Stack>

            <FormLayout
              title="Details"
              textSize="lg"
              fontWeight="medium"
              description={
                <p className="w-full  h-full">
                  Provide detailed information about this experience of the
                  event.
                </p>
              }
              id={`experience-details-${index}`}
            >
              <RichTextEditor
                content={
                  (getValues(`experienceData.${index}.details`) as string) || ""
                }
                label={`experienceData.${index}.details`}
                register={register}
              />
            </FormLayout>
            <div className="pb-5!" />
          </div>
        </div>
      </FormLayout>
    </div>
  );
}
