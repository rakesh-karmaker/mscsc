import { TextField } from "@mui/material";
import type {
  ChangeHandler,
  RegisterOptions,
  SetValueConfig,
} from "react-hook-form";
import FormLayout from "../form-layout";
import HeroIconsSelect from "./select/hero-icons-select";
import type { ReactNode } from "react";

type HeroSectionFieldsProps = {
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
  getValues: (payload?: string | string[]) => Object;
};

export default function HeroSectionFields({
  register,
  setValue,
  errors,
  getValues,
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
            {...register("heroHeading", {
              maxLength: {
                value: 60,
                message: "Heading cannot exceed 60 characters",
              },
            })}
            label="Hero Heading"
            error={Boolean(errors.heroHeading)}
            helperText={errors.heroHeading?.message as string}
          />

          <TextField
            fullWidth
            variant="outlined"
            {...register("heroText")}
            multiline
            minRows={5}
            label="Hero Text"
            error={Boolean(errors.heroText)}
            helperText={errors.heroText?.message as string}
          />
        </div>
        <HeroIconsSelect setValue={setValue} getValues={getValues} />
      </div>
    </FormLayout>
  );
}
