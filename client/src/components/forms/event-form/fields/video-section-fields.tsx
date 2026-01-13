import { type ReactNode } from "react";
import FormLayout from "../form-layout";
import FileInput from "@/components/ui/file-input";

type VideoSectionFieldsProps = {
  register: any;
  errors: { [key: string]: any };
};

export default function VideoSectionFields({
  register,
  errors,
}: VideoSectionFieldsProps): ReactNode {
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
      <FileInput
        register={register}
        name="videoFile"
        errors={errors}
        labelText="Upload Video File"
        accept="video/*"
      >
        Upload Video
      </FileInput>
    </FormLayout>
  );
}
