import { useState, type ReactNode } from "react";
import { useWatch, type Control } from "react-hook-form";
import FormLayout from "../../form-layout";
import { Stack, TextField } from "@mui/material";
import { useSortable } from "@dnd-kit/react/sortable";
import LuArrowDown from "~icons/lucide/arrow-down";
import LuArrowUp from "~icons/lucide/arrow-up";
import LuGripVertical from "~icons/lucide/grip-vertical";
import FileInput from "@/components/ui/file-input";

export default function SPFields({
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
      name: `spData.${index}.name`,
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
          <p className="line-clamp-1">
            {title || `Sponsor/Partner Item ${index + 1}`}
          </p>
        }
        description={
          <p className="w-full min-w-[30ch] h-full">
            Details for sponsor/partner item {index + 1}.
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
              className="pt-5!"
            >
              <TextField
                fullWidth
                variant="outlined"
                {...register(`spData.${index}.name`, {
                  maxLength: {
                    value: 100,
                    message: "Name cannot exceed 100 characters",
                  },
                  required: isSectionSelected
                    ? "Sponsor/Partner name is required"
                    : false,
                })}
                label="Sponsor/Partner Name"
                error={Boolean(
                  errors.spData &&
                  errors.spData[index] &&
                  errors.spData[index].name,
                )}
                helperText={
                  errors.spData &&
                  errors.spData[index] &&
                  errors.spData[index].name &&
                  (errors.spData[index].name.message as string)
                }
              />

              <FileInput
                register={register}
                name={`spData.${index}.logoFile`}
                errors={errors}
                labelText="Upload Logo File"
                accept="image/*"
              >
                Upload Logo
              </FileInput>
            </Stack>

            <TextField
              fullWidth
              variant="outlined"
              {...register(`spData.${index}.websiteUrl`, {
                required: isSectionSelected ? "Website URL is required" : false,
                pattern: {
                  value: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/,
                  message: "Please enter a valid URL",
                },
              })}
              label="Website URL"
              multiline
              error={Boolean(
                errors.spData &&
                errors.spData[index] &&
                errors.spData[index].websiteUrl,
              )}
              helperText={
                errors.spData &&
                errors.spData[index] &&
                errors.spData[index].websiteUrl &&
                (errors.spData[index].websiteUrl.message as string)
              }
              placeholder="Enter the website or social URL of the sponsor/partner."
            />
            <div className="pb-5!" />
          </div>
        </div>
      </FormLayout>
    </div>
  );
}
