import { useEffect, type ReactNode } from "react";
import { Controller, useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../form-layout";
import { Stack, TextField } from "@mui/material";
import { icons } from "@/services/data/icons-data";
import SelectIconField from "@/components/ui/select-icon-field";
import { DatePicker } from "@/components/ui/date-picker";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@/components/ui/time-picker";

type ScheduleSectionFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
};

export default function ScheduleSectionFields({
  register,
  control,
  errors,
  isSectionSelected,
}: ScheduleSectionFieldsProps): ReactNode {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "schedule",
  });

  function handleAppend() {
    append({
      icon: "games",
      date: "",
      fromTime: "",
      toTime: "",
      title: "",
      description: "",
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
      title={"Schedule Section"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          Define the schedule for the event, including dates, times, and
          descriptions of each scheduled item.
        </p>
      }
    >
      <div className="w-full h-full flex flex-col gap-4">
        {fields.map((field, index) => (
          <FormLayout
            key={field.id}
            title={`Schedule item ${index + 1}`}
            description={
              <p className="w-full min-w-[30ch] h-full">
                Details for schedule item {index + 1}.
              </p>
            }
            textSize="lg"
            fontWeight="medium"
          >
            <div className="w-full flex flex-col gap-4">
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ width: "100%" }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  {...register(`schedule.${index}.title`, {
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
                    errors.schedule &&
                    errors.schedule[index] &&
                    errors.schedule[index].title,
                  )}
                  helperText={
                    errors.schedule &&
                    errors.schedule[index] &&
                    errors.schedule[index].title &&
                    (errors.schedule[index].title.message as string)
                  }
                />

                <div className="min-w-70.5">
                  <SelectIconField
                    id={`schedule-icon-${index}`}
                    name={`schedule.${index}.icon`}
                    icons={icons}
                    control={control}
                    hasErrors={Boolean(errors?.schedule?.[index]?.icon)}
                    errorMessage={
                      errors.schedule?.[index]?.icon?.message as string
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
                  name={`schedule.${index}.date`}
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value || dayjs()}
                      onChange={(date: Dayjs | null) => field.onChange(date)}
                      label="Schedule Date"
                    />
                  )}
                />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <Controller
                    name={`schedule.${index}.fromTime`}
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        {...field}
                        value={field.value || dayjs()}
                        onChange={(date: Dayjs | null) => field.onChange(date)}
                        label="From Time"
                      />
                    )}
                  />

                  <Controller
                    name={`schedule.${index}.toTime`}
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        {...field}
                        value={field.value || dayjs()}
                        onChange={(date: Dayjs | null) => field.onChange(date)}
                        label="To Time"
                      />
                    )}
                  />
                </Stack>
              </Stack>

              <TextField
                fullWidth
                variant="outlined"
                {...register(`schedule.${index}.description`, {
                  required: isSectionSelected
                    ? "Schedule description is required"
                    : false,
                })}
                label="Schedule Description"
                multiline
                minRows={4}
                error={Boolean(
                  errors.schedule &&
                  errors.schedule[index] &&
                  errors.schedule[index].description,
                )}
                helperText={
                  errors.schedule &&
                  errors.schedule[index] &&
                  errors.schedule[index].description &&
                  (errors.schedule[index].description.message as string)
                }
                placeholder="A short summary of the event"
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
            Add Schedule Item
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
