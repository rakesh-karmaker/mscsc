import type React from "react";
import { useRef, type ReactNode } from "react";
import { FaUpload } from "react-icons/fa";
import type { FieldErrors, UseFormRegister, Path } from "react-hook-form";
import type { RegisterSchemaType } from "@/lib/validation/register-schema";
import type { EditUserSchemaType } from "@/lib/validation/edit-user-schema";
import type { ActivitySchemaType } from "@/lib/validation/activity-schema";

import "./file-input.css";

type FileInputProps<
  T extends RegisterSchemaType | EditUserSchemaType | ActivitySchemaType
> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  children: string;
  name: Path<T>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FileInput<
  T extends RegisterSchemaType | EditUserSchemaType | ActivitySchemaType
>({
  register,
  errors,
  children,
  name,
  onChange,
}: FileInputProps<T>): ReactNode {
  const labelRef = useRef<HTMLLabelElement>(null);

  const { onChange: registerOnChange, ...registerProps } = register(name);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Call React Hook Form's onChange first
    registerOnChange(e);

    if (e.target.files && e.target.files.length) {
      const fileName = e.target.files[0].name;
      if (labelRef.current) {
        labelRef.current.innerHTML =
          fileName.slice(0, 20) + (fileName.length > 20 ? "..." : "");
      }
    } else {
      if (labelRef.current) {
        labelRef.current.innerHTML =
          "<div class='highlighted-text'><svg stroke='currentColor' fill='currentColor' strokeWidth='0' viewBox='0 0 512 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><path d='M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'></path></svg> <span>Upload File</span></div>";
      }
      // Clear the file input value when no file is selected
      e.target.value = "";
    }

    // Call the additional onChange handler if provided
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="file-input">
      <p className="input-heading">{children}</p>
      <input
        {...registerProps}
        id={name as string}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      <label
        ref={labelRef}
        htmlFor={name as string}
        className="highlighted-text file-label flex gap-2 items-center"
      >
        <FaUpload /> <span>Upload File</span>
      </label>

      {"message" in (errors?.[name as keyof typeof errors] ?? {}) &&
        typeof (errors?.[name as keyof typeof errors] as { message?: unknown })
          ?.message === "string" && (
          <p className="error-message">
            {
              (errors?.[name as keyof typeof errors] as { message?: string })
                ?.message
            }
          </p>
        )}
    </div>
  );
}
