import { TextField } from "@mui/material";
import type { ChangeHandler, Control, RegisterOptions } from "react-hook-form";
import FormLayout from "../form-layout";
import HeroIconsSelect from "./select/hero-icons-select";
import type { ReactNode } from "react";

type HeroSectionFieldsProps = {
  register: (
    name: string,
    options?: RegisterOptions,
  ) => {
    ref: React.Ref<any>;
    name: string;
    onChange: ChangeHandler;
    onBlur: ChangeHandler;
  };
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
};

export default function HeroSectionFields({
  register,
  control,
  errors,
  isSectionSelected,
}: HeroSectionFieldsProps): ReactNode {
  return (
    <FormLayout
      title={"Hero Section"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          The hero section is the first section of the event page. It typically
          contains the event title, date, and a call-to-action button.
        </p>
      }
    >
      <div className="w-full h-full flex gap-4 max-md:flex-col">
        <div className="w-full flex flex-col gap-4">
          <TextField
            fullWidth
            variant="outlined"
            {...register("heroData.heading", {
              maxLength: {
                value: 60,
                message: "Heading cannot exceed 60 characters",
              },
              required: isSectionSelected ? "Hero heading is required" : false,
            })}
            label="Hero Heading"
            error={Boolean(errors.heroData?.heading)}
            helperText={errors.heroData?.heading?.message as string}
          />

          <TextField
            fullWidth
            variant="outlined"
            {...register("heroData.text", {
              required: isSectionSelected ? "Hero text is required" : false,
            })}
            multiline
            minRows={5}
            label="Hero Text"
            error={Boolean(errors.heroData?.text)}
            helperText={errors.heroData?.text?.message as string}
          />
        </div>
        <HeroIconsSelect control={control} errors={errors} />
      </div>
    </FormLayout>
  );
}
