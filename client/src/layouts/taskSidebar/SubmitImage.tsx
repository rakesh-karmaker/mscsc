import { useState, type ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type SubmitImageProps = {
  register: UseFormRegister<{ content: string; poster: FileList }>;
  errors: FieldErrors<{ content: string; poster: FileList }>;
  didSubmit: boolean;
  imageRequired: boolean;
};

export default function SubmitImage({
  register,
  errors,
  didSubmit,
  imageRequired,
}: SubmitImageProps): ReactNode {
  const MAX_FILE_SIZE = 1024 * 1024 * 2;
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="image-container">
      <label className="image-label" htmlFor="poster">
        {file ? "Added" : "Add Image"}
      </label>
      <input
        onInput={(e) => {
          const input = e.target as HTMLInputElement;
          setFile(input.files ? input.files[0] : null);
        }}
        type="file"
        accept="image/*"
        hidden
        id="poster"
        {...register("poster", {
          validate: (value) => {
            if (value.length > 0 || didSubmit || !imageRequired) {
              if (value[0]?.size > MAX_FILE_SIZE) {
                return `Max image size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
              } else {
                return true;
              }
            } else {
              return "Please upload a Image";
            }
          },
        })}
      />
      {errors.poster && (
        <p className="error-message">{errors.poster.message}</p>
      )}
    </div>
  );
}
