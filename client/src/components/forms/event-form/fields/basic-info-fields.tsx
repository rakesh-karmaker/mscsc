import { Stack, TextField } from "@mui/material";
import { type ReactNode } from "react";
import { Controller, type SetValueConfig } from "react-hook-form";
import FormLayout from "../form-layout";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import type { Dayjs } from "dayjs";
import { DatePicker } from "@/components/ui/date-picker";
import FileInput from "@/components/ui/file-input";

type BasicInfoFieldsProps = {
  register: any;
  setValue: (name: string, value: unknown, config?: SetValueConfig) => void;
  errors: { [key: string]: any };
  control: any;
  defaultValues?: any;
};

export default function BasicInfoFields({
  register,
  errors,
  control,
}: BasicInfoFieldsProps): ReactNode {
  return (
    <FormLayout
      title={"Event Basic Information"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          Provide the essential details about the event, including its name,
          date, location, and a brief description.
        </p>
      }
    >
      <div className="flex flex-col gap-4 mt-2!">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            {...register("eventName", {
              required: "Event name is required",
              maxLength: {
                value: 100,
                message: "Event name cannot exceed 100 characters",
              },
            })}
            label="Event Name"
            error={Boolean(errors.eventName)}
            helperText={errors.eventName?.message as string}
          />

          <Controller
            name="eventDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                value={field.value}
                onChange={(date: Dayjs | null) => field.onChange(date)}
                label="Event Date"
              />
            )}
          />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            {...register("eventLocation", {
              required: "Event location is required",
              maxLength: {
                value: 100,
                message: "Event location cannot exceed 100 characters",
              },
            })}
            label="Event Location"
            error={Boolean(errors.eventLocation)}
            helperText={errors.eventLocation?.message as string}
          />

          <Controller
            name="formData.registrationDeadline"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                value={field.value}
                onChange={(date: Dayjs | null) => field.onChange(date)}
                label="Registration Deadline"
                timeField={false}
              />
            )}
          />
        </Stack>

        <TextField
          fullWidth
          variant="outlined"
          {...register("eventDescription", {
            required: "Event description is required",
          })}
          multiline
          minRows={4}
          label="Event Description"
          error={Boolean(errors.eventDescription)}
          helperText={errors.eventDescription?.message as string}
        />

        <Stack
          direction={{ sm: "column", md: "row" }}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            {...register("registrationUrl", {
              pattern: {
                value: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/,
                message: "Please enter a valid URL",
              },
            })}
            label="Registration URL (optional)"
            error={Boolean(errors.registrationUrl)}
            helperText={errors.registrationUrl?.message as string}
            placeholder="Only enter if you have an external form link"
          />

          <div className="w-fit max-md:mt-3!">
            <FileInput
              register={register}
              name="eventLogoUrl"
              errors={errors}
              addText={false}
              className="p-[14px_22px]! min-w-fit!"
            >
              Upload Logo
            </FileInput>
          </div>

          <div className="w-fit max-md:mt-3!">
            <FileInput
              register={register}
              name="eventLogoFaviconUrl"
              errors={errors}
              addText={false}
              className="p-[14px_22px]! min-w-fit!"
            >
              Upload Favicon
            </FileInput>
          </div>
        </Stack>
      </div>
    </FormLayout>
  );
}
