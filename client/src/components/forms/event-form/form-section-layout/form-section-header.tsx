import { sectionsTitle } from "@/services/data/event-form-data";
import FaChevronDown from "~icons/fa-solid/chevron-down";
import type { ReactNode } from "react";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import { TableBtn } from "@/components/ui/btns";

type FormSectionHeaderProps = {
  title: string;
  currentNumber: number;
  totalSections: number;
  handleFieldChange: (
    method: "next" | "previous" | "jump",
    jumpToField?: string,
  ) => void;
  currentField: string;
  errors: { [key: string]: any };
  sections: string[];
};

export default function FormSectionHeader({
  title,
  currentNumber,
  totalSections,
  handleFieldChange,
  currentField,
  errors,
  sections,
}: FormSectionHeaderProps): ReactNode {
  const { basic, ...rest } = sectionsTitle;
  const sectionNameMap: { [key: string]: string } = {
    basic: "Basic Information",
    ...rest,
  };
  const [sectionPopoverOpen, setSectionPopoverOpen] = useState(false);
  const sectionPopoverId = "form-section-header-popover";

  return (
    <div className="w-full flex justify-between items-center gap-3 p-5! max-sm:px-0! border-b border-gray-400 max-md:flex-col-reverse">
      <h2 className="w-full text-2xl max-w-full max-lg:text-xl font-semibold line-clamp-2">
        {title}
      </h2>

      <div className="w-full flex justify-end">
        <button
          id={sectionPopoverId}
          className={`w-fit min-w-fit h-fit px-3! py-1.5! flex items-center gap-2 text-base cursor-pointer font-medium text-white ${Object.keys(errors).length > 0 ? "bg-red-600" : "bg-highlighted-color"} hover:opacity-80 transition-all duration-200 rounded-sm`}
          onClick={() => setSectionPopoverOpen(!sectionPopoverOpen)}
          type="button"
          aria-describedby={sectionPopoverId}
        >
          <span className="w-full">
            Section {currentNumber} of{" "}
            {sections.includes("contact") ? totalSections - 1 : totalSections}
          </span>
          <span
            className="text-base text-white transition-all duration-300"
            style={{
              rotate: sectionPopoverOpen ? "180deg" : "0deg",
            }}
          >
            <FaChevronDown />
          </span>
        </button>
        <Popover
          id={sectionPopoverId}
          open={sectionPopoverOpen}
          anchorEl={document.getElementById(sectionPopoverId)}
          onClose={() => setSectionPopoverOpen(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              boxShadow: "rgba(149, 157, 165, 0.1) 0px 8px 24px",
              marginTop: "4px",
            },
          }}
        >
          <div className="w-full h-full flex flex-col bg-primary-bg rounded-md border border-gray-300">
            <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
              <TableBtn
                onClick={() => {
                  handleFieldChange("jump", "basic");
                  setSectionPopoverOpen(false);
                }}
                type="button"
                className={
                  currentField === "basic" ? "bg-highlighted-color/10" : ""
                }
              >
                {sectionNameMap["basic"]}
              </TableBtn>
              {sections
                .filter((s) => s != "contact")
                .map((section) => (
                  <TableBtn
                    key={section}
                    onClick={() => {
                      handleFieldChange("jump", section);
                      setSectionPopoverOpen(false);
                    }}
                    type="button"
                    className={
                      currentField === section ? "bg-highlighted-color/10" : ""
                    }
                  >
                    {sectionNameMap[section]}
                  </TableBtn>
                ))}
              <TableBtn
                onClick={() => {
                  handleFieldChange("jump", "final");
                  setSectionPopoverOpen(false);
                }}
                type="button"
                className={
                  currentField === "final" ? "bg-highlighted-color/10" : ""
                }
              >
                {sectionNameMap["final"]}
              </TableBtn>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
}
