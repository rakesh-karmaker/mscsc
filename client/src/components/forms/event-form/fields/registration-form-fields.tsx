import { useState, type ReactNode } from "react";
import { Controller, type Control } from "react-hook-form";
import FormLayout from "../form-layout";
import RadioField from "@/components/ui/radio-field";
import { Stack, TextField } from "@mui/material";
import type { Dayjs } from "dayjs";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";

type RegistrationFormFields = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
};

export default function RegistrationFormFields({
  register,
  control,
  errors,
}: RegistrationFormFields): ReactNode {
  const [hasCAForm, setHasCAForm] = useState<string>("no");
  return (
    <FormLayout
      title={"Registration Form Information"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          Configure the details for the Registration Form for this event.
        </p>
      }
    >
      <div className="w-full h-full flex flex-col gap-1.5">
        <RadioField
          options={["yes", "no"]}
          onClick={(option) => setHasCAForm(option)}
          selectedOption={hasCAForm}
          errors={errors.hasCAForm}
        >
          Do you want to make a CA Application Form?
        </RadioField>
      </div>
      <div
        className="w-full h-fit overflow-hidden grid transition-all duration-200 ease-in-out"
        style={{
          gridTemplateRows: hasCAForm == "yes" ? "1fr" : "0fr",
        }}
      >
        <div className="flex flex-col gap-4 mt-2! h-fit w-fit overflow-hidden">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ width: "100%" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              {...register("caApplicationTitle", {
                required: "CA Application Form title is required",
              })}
              label="CA Application Form Title"
              error={Boolean(errors.eventName)}
              helperText={errors.eventName?.message as string}
            />

            <Controller
              name="CAApplicationDeadline"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  value={field.value}
                  onChange={(date: Dayjs | null) => field.onChange(date)}
                  label="CA Application Deadline"
                />
              )}
            />
          </Stack>

          <FormLayout
            title="CA Application Details"
            textSize="lg"
            fontWeight="medium"
            description={
              <p className="w-full min-w-[30ch] h-full">
                Provide detailed information about the CA Application process.
              </p>
            }
          >
            <RichTextEditor
              register={register}
              label="caApplicationDetails"
              content=""
            />
          </FormLayout>
        </div>
      </div>
    </FormLayout>
  );
}
