import { type ReactNode } from "react";
import FormLayout from "../form-layout";
import { TextField } from "@mui/material";
import FileInput from "@/components/ui/file-input";

type AboutSectionFieldsProps = {
  register: any;
  errors: { [key: string]: any };
};

export default function AboutSectionFields({
  register,
  errors,
}: AboutSectionFieldsProps): ReactNode {
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
          {...register("aboutText")}
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
          textSize="xl"
        >
          <FileInput register={register} name="aboutImageFile" errors={errors}>
            Upload Image
          </FileInput>
        </FormLayout>
      </div>
    </FormLayout>
  );
}
