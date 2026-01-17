import { Radio } from "@mui/material";
import type { ReactNode } from "react";

type RadioFieldProps = {
  options: string[];
  onClick: (option: string) => void;
  selectedOption: string;
  children: ReactNode;
  errors: any;
};

export default function RadioField({
  options,
  onClick,
  selectedOption,
  children,
  errors,
}: RadioFieldProps) {
  return (
    <div className="w-full h-full flex flex-col gap-1.5">
      {children}
      <div className="w-full flex gap-3 items-center">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onClick(option)}
            className="flex items-center pl-2! py-0.75! pr-5! rounded-sm border hover:bg-[#f1f1f2]! transition-colors cursor-pointer"
            style={{
              background:
                selectedOption === option
                  ? "color-mix(in oklab, var(--highlighted-color) 20%, transparent)"
                  : "color-mix(in oklab, var(--white) 20%, transparent)",
            }}
            type="button"
          >
            <div className="pointer-events-none flex items-center">
              <Radio
                checked={selectedOption === option}
                value={option}
                name="gender"
                inputProps={{ "aria-label": option }}
                style={{
                  color: "var(--primary-color)",
                }}
              />
              <span className="text-primary capitalize">{option}</span>
            </div>
          </button>
        ))}
      </div>
      {errors && (
        <p className="text-red-600 text-sm">{errors.message as string}</p>
      )}
    </div>
  );
}
