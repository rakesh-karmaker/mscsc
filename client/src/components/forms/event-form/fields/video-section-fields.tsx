import { type ReactNode } from "react";
import FormLayout from "../form-layout";
import { TextField } from "@mui/material";

type VideoSectionFieldsProps = {
  register: any;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
};

export default function VideoSectionFields({
  register,
  errors,
  isSectionSelected,
}: VideoSectionFieldsProps): ReactNode {
  return (
    <FormLayout
      title={"Video Section"}
      description={
        <p className="w-full  h-full">
          The video section showcases a promotional or informational video about
          the event. It helps to engage visitors and provide them with more
          context about the event.
        </p>
      }
      id="video-section"
    >
      <TextField
        fullWidth
        variant="outlined"
        {...register("videoData.url", {
          required: isSectionSelected ? "Video URL is required" : false,
        })}
        label="Video URL"
        error={Boolean(errors.videoData?.url)}
        helperText={errors.videoData?.url?.message as string}
      />
    </FormLayout>
  );
}
