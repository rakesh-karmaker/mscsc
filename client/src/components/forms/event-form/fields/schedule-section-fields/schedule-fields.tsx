import { useState, type ReactNode } from "react";
import { Controller, useWatch, type Control } from "react-hook-form";
import FormLayout from "../../form-layout";
import { Stack, TextField } from "@mui/material";
import { icons } from "@/services/data/icons-data";
import SelectIconField from "@/components/ui/select-icon-field";
import { useSortable } from "@dnd-kit/react/sortable";
import LuArrowDown from "~icons/lucide/arrow-down";
import LuArrowUp from "~icons/lucide/arrow-up";
import LuGripVertical from "~icons/lucide/grip-vertical";
import { DatePicker } from "@/components/ui/date-picker";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@/components/ui/time-picker";

export default function ScheduleItemFields({
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
      name: `scheduleData.${index}.title`,
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
            {title || `Schedule Item ${index + 1}`}
          </p>
        }
        description={
          <p className="w-full  h-full">
            Details for schedule item {index + 1}.
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
        id={`schedule-item-${index}`}
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
                {...register(`scheduleData.${index}.title`, {
                  required: isSectionSelected
                    ? "Schedule title is required"
                    : false,
                  maxLength: {
                    value: 100,
                    message: "Title cannot exceed 100 characters",
                  },
                })}
                label="Schedule Title"
                error={Boolean(
                  errors.scheduleData &&
                  errors.scheduleData[index] &&
                  errors.scheduleData[index].title,
                )}
                helperText={
                  errors.scheduleData &&
                  errors.scheduleData[index] &&
                  errors.scheduleData[index].title &&
                  (errors.scheduleData[index].title.message as string)
                }
              />

              <div className="min-w-70.5">
                <SelectIconField
                  id={`schedule-icon-${index}`}
                  name={`scheduleData.${index}.icon`}
                  icons={icons}
                  control={control}
                  hasErrors={Boolean(errors?.scheduleData?.[index]?.icon)}
                  errorMessage={
                    errors.scheduleData?.[index]?.icon?.message as string
                  }
                  defaultValue="clock"
                >
                  Icon
                </SelectIconField>
              </div>
            </Stack>

            <Stack
              direction={{ sm: "column", lg: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
            >
              <Controller
                name={`scheduleData.${index}.date`}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={dayjs(field.value)}
                    onChange={(date: Dayjs | null) => field.onChange(date)}
                    label="Schedule Date"
                    errMessage={
                      errors.scheduleData?.[index]?.date?.message as string
                    }
                  />
                )}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ width: "100%" }}
              >
                <Controller
                  name={`scheduleData.${index}.fromTime`}
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      value={dayjs(field.value)}
                      onChange={(date: Dayjs | null) => field.onChange(date)}
                      label="From Time"
                      errMessage={
                        errors.scheduleData?.[index]?.fromTime
                          ?.message as string
                      }
                    />
                  )}
                />

                <Controller
                  name={`scheduleData.${index}.toTime`}
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      value={dayjs(field.value)}
                      onChange={(date: Dayjs | null) => field.onChange(date)}
                      label="To Time"
                      errMessage={
                        errors.scheduleData?.[index]?.toTime?.message as string
                      }
                    />
                  )}
                />
              </Stack>
            </Stack>

            <TextField
              fullWidth
              variant="outlined"
              {...register(`scheduleData.${index}.description`, {
                required: isSectionSelected
                  ? "Schedule description is required"
                  : false,
              })}
              label="Schedule Description"
              multiline
              minRows={4}
              error={Boolean(
                errors.scheduleData &&
                errors.scheduleData[index] &&
                errors.scheduleData[index].description,
              )}
              helperText={
                errors.scheduleData &&
                errors.scheduleData[index] &&
                errors.scheduleData[index].description &&
                (errors.scheduleData[index].description.message as string)
              }
              placeholder="A short summary of the event"
            />
            <div className="pb-5!" />
          </div>
        </div>
      </FormLayout>
    </div>
  );
}
