import { Checkbox, FormControlLabel } from "@mui/material";
import type { Dispatch, ReactNode, SetStateAction } from "react";

type HideSectionSelectProps = {
  hiddenSections: string[];
  setHiddenSections: Dispatch<SetStateAction<string[]>>;
  section: string;
};

export default function HideSectionSelect({
  hiddenSections,
  setHiddenSections,
  section,
}: HideSectionSelectProps): ReactNode {
  if (section === "basic" || section === "final") return null;

  return (
    <div className="w-full h-full mt-3!">
      <FormControlLabel
        control={
          <Checkbox
            checked={hiddenSections.includes(section)}
            style={{
              color: "var(--primary-color)",
            }}
            onChange={() => {
              if (hiddenSections.includes(section)) {
                setHiddenSections(hiddenSections.filter((s) => s !== section));
              } else {
                setHiddenSections([...hiddenSections, section]);
              }
            }}
          />
        }
        label={"Hide this section on the event page"}
        style={{
          color: "var(--primary-color)",
          userSelect: "none",
        }}
      />
    </div>
  );
}
