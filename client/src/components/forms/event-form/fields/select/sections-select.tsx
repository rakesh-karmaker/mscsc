import { sectionsData } from "@/services/data/event-form-data";
import capitalize from "@/utils/capitalize";
import { Checkbox, FormControlLabel } from "@mui/material";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type {
  ChangeHandler,
  RegisterOptions,
  SetValueConfig,
} from "react-hook-form";

export default function SectionsSelect({
  register,
  setValue,
  selectedSections,
  setSelectedSections,
}: {
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
  selectedSections: string[];
  setSelectedSections: Dispatch<SetStateAction<string[]>>;
}): ReactNode {
  return (
    <div className="w-full flex flex-wrap gap-4">
      {sectionsData.sectionOptions.map((section, index) => (
        <div
          key={index}
          className="flex items-center px-1.5! py-0.5! pl-4! rounded-sm border border-black/20 hover:bg-lightest-black/20! transition-colors cursor-pointer"
          style={{
            background: selectedSections.includes(section)
              ? "color-mix(in oklab, var(--highlighted-color) 20%, transparent)"
              : "color-mix(in oklab, var(--white) 20%, transparent)",
          }}
          onClick={() => {
            let updatedSections: string[] = [];
            if (selectedSections.includes(section)) {
              updatedSections = selectedSections.filter(
                (item) => item !== section
              );
            } else {
              updatedSections = [...selectedSections, section];
            }
            setSelectedSections(updatedSections);
            setValue("sections", updatedSections); // Sync with form
          }}
        >
          <div className="pointer-events-none select-none">
            <FormControlLabel
              control={
                <Checkbox
                  {...register("sections")}
                  checked={selectedSections.includes(section)}
                  style={{
                    color: "var(--primary-color)",
                  }}
                />
              }
              label={capitalize(section)}
              style={{
                pointerEvents: "none",
                color: "var(--primary-color)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
