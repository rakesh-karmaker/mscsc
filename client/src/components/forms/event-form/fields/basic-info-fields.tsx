import { Button, Stack, TextField, Tooltip } from "@mui/material";
import { useState, type ReactNode } from "react";
import {
  Controller,
  type ChangeHandler,
  type RegisterOptions,
  type SetValueConfig,
} from "react-hook-form";
import FormLayout, { VisuallyHiddenInput } from "../form-layout";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { IoMdCloudUpload } from "react-icons/io";

type BasicInfoFieldsProps = {
  register: (
    name: string,
    options?: RegisterOptions
  ) => {
    ref: React.Ref<any>;
    name: string;
    onChange: ChangeHandler;
    onBlur: ChangeHandler;
  };
  setValue: (name: string, value: unknown, config?: SetValueConfig) => void;
  errors: { [key: string]: any };
  control: any;
  defaultValues?: any;
};

export default function BasicInfoFields({
  register,
  setValue,
  errors,
  control,
  defaultValues,
}: BasicInfoFieldsProps): ReactNode {
  const [hasEventLogoSelected, setHasEventLogoSelected] =
    useState<boolean>(false);

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
              <DateTimePicker
                {...field}
                value={field.value || dayjs(defaultValues?.eventDate)}
                onChange={(date: Dayjs | null) => field.onChange(date)}
                label="Event Date"
                timeField={false}
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
            name="registrationDeadline"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                value={
                  field.value || dayjs(defaultValues?.registrationDeadline)
                }
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
          direction={{ xs: "column", sm: "row" }}
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

          <div className="flex flex-col gap-3 min-w-fit">
            <Tooltip title="Upload an event logo" arrow>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<IoMdCloudUpload />}
                className="max-w-fit"
              >
                {hasEventLogoSelected ? "Logo Selected" : "Upload Logo"}
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => {
                    setValue("eventLogoUrl", event.target.files);
                    setHasEventLogoSelected(
                      Boolean(
                        event.target.files && event.target.files.length > 0
                      )
                    );
                  }}
                  accept="image/*"
                />
              </Button>
            </Tooltip>
            {errors.eventLogoUrl && (
              <p className="text-red-600 text-sm">
                {errors.eventLogoUrl.message as string}
              </p>
            )}
          </div>
        </Stack>
      </div>
    </FormLayout>
  );
}
