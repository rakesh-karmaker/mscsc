import { useState, type ReactNode } from "react";
import type {
  ChangeHandler,
  RegisterOptions,
  SetValueConfig,
} from "react-hook-form";
import FormLayout from "./form-layout";
import { Button, styled, TextField } from "@mui/material";
import { IoMdCloudUpload } from "react-icons/io";

type AboutSectionFormProps = {
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
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function AboutSectionForm({
  register,
  setValue,
  errors,
}: AboutSectionFormProps): ReactNode {
  const [hasAboutImageSelected, setHasAboutImageSelected] =
    useState<boolean>(false);

  return (
    <FormLayout
      title={"About Section"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          The about section provides detailed information about the event,
          including its purpose, agenda, speakers, and other relevant details.
        </p>
      }
    >
      <div className="flex flex-col gap-4">
        <TextField
          fullWidth
          variant="outlined"
          {...register("aboutTitle", {
            required: "Title is required",
            maxLength: {
              value: 60,
              message: "Title cannot exceed 60 characters",
            },
          })}
          label="About Title"
          error={Boolean(errors.aboutTitle)}
          helperText={errors.aboutTitle?.message as string}
        />

        <TextField
          fullWidth
          variant="outlined"
          {...register("aboutHeading", {
            required: "Heading is required",
            maxLength: {
              value: 100,
              message: "Heading cannot exceed 100 characters",
            },
          })}
          label="About Heading"
          error={Boolean(errors.aboutHeading)}
          helperText={errors.aboutHeading?.message as string}
        />

        <TextField
          fullWidth
          variant="outlined"
          {...register("aboutText", {
            required: "Text is required",
          })}
          multiline
          minRows={5}
          label="About Text"
          error={Boolean(errors.aboutText)}
          helperText={errors.aboutText?.message as string}
        />

        <FormLayout
          title={"About Section Image"}
          description={
            <p className="w-full min-w-[30ch] h-full">
              The about image visually represents the event and enhances the
              overall design of the about section.
            </p>
          }
        >
          <div className="flex flex-col gap-3">
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<IoMdCloudUpload />}
              className="max-w-fit"
            >
              {hasAboutImageSelected ? "Image Selected" : "Upload Image"}
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => {
                  setValue("aboutImageFile", event.target.files);
                  setHasAboutImageSelected(
                    Boolean(event.target.files && event.target.files.length > 0)
                  );
                }}
                accept="image/*"
              />
            </Button>
            {errors.aboutImageFile && (
              <p className="text-red-600 text-sm">
                {errors.aboutImageFile.message as string}
              </p>
            )}
          </div>
        </FormLayout>
      </div>
    </FormLayout>
  );
}
