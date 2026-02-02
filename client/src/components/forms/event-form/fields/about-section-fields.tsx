import { type ReactNode } from "react";
import FormLayout from "../form-layout";
import { Stack, TextField } from "@mui/material";
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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            {...register("aboutData.title", {
              maxLength: {
                value: 60,
                message: "Title cannot exceed 60 characters",
              },
            })}
            label="About Title"
            error={Boolean(errors.aboutData?.title)}
            helperText={errors.aboutData?.title?.message as string}
          />

          <TextField
            fullWidth
            variant="outlined"
            {...register("aboutData.prizeCount", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Prize count cannot be negative",
              },
            })}
            label="Number of Prizes"
            error={Boolean(errors.aboutData?.prizeCount)}
            helperText={errors.aboutData?.prizeCount?.message as string}
            sx={{ maxWidth: "300px" }}
          />
        </Stack>

        <TextField
          fullWidth
          variant="outlined"
          {...register("aboutData.heading")}
          label="About Heading"
          error={Boolean(errors.aboutData?.heading)}
          helperText={errors.aboutData?.heading?.message as string}
        />

        <TextField
          fullWidth
          variant="outlined"
          {...register("aboutData.text")}
          multiline
          minRows={5}
          label="About Text"
          error={Boolean(errors.aboutData?.text)}
          helperText={errors.aboutData?.text?.message as string}
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
          <FileInput
            register={register}
            name="aboutImageFile"
            errors={errors}
            labelText="Add about image (optional)"
          >
            Upload Image
          </FileInput>
        </FormLayout>
      </div>
    </FormLayout>
  );
}
