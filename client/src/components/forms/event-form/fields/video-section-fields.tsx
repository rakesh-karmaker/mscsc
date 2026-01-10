import { Button } from "@mui/material";
import { useState, type ReactNode } from "react";
import type { SetValueConfig } from "react-hook-form";
import FormLayout, { VisuallyHiddenInput } from "../form-layout";
import { IoMdCloudUpload } from "react-icons/io";

type VideoSectionFieldsProps = {
  setValue: (name: string, value: unknown, config?: SetValueConfig) => void;
  errors: { [key: string]: any };
};

export default function VideoSectionFields({
  setValue,
  errors,
}: VideoSectionFieldsProps): ReactNode {
  const [hasVideoSelected, setHasVideoSelected] = useState<boolean>(false);

  return (
    <FormLayout
      title={"Video Section"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          The video section showcases a promotional or informational video about
          the event. It helps to engage visitors and provide them with more
          context about the event.
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
          {hasVideoSelected ? "Video Selected" : "Upload Video"}
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => {
              setValue("videoFile", event.target.files);
              setHasVideoSelected(
                Boolean(event.target.files && event.target.files.length > 0)
              );
            }}
            accept="video/*"
          />
        </Button>
        {errors.videoFile && (
          <p className="text-red-600 text-sm">
            {errors.videoFile.message as string}
          </p>
        )}
      </div>
    </FormLayout>
  );
}
