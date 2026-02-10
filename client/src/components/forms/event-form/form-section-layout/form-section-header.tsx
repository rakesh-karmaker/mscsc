import { sectionsTitle } from "@/services/data/event-form-data";
import { FaChevronDown } from "react-icons/fa";
import type { Dispatch, ReactNode, SetStateAction } from "react";

type FormSectionHeaderProps = {
  title: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
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
  isDropdownOpen,
  setIsDropdownOpen,
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

  return (
    <div className="w-full flex justify-between items-center gap-3 p-5! max-sm:px-0! border-b border-gray-400 max-md:flex-col-reverse">
      <h2 className="w-full text-2xl max-w-full max-lg:text-xl font-semibold line-clamp-2">
        {title}
      </h2>
      <div className="w-full h-full relative flex justify-end max-md:justify-start">
        <button
          className={`w-fit min-w-fit h-fit px-3! py-1.5! flex items-center gap-2 text-base cursor-pointer font-medium text-white ${Object.keys(errors).length > 0 ? "bg-red-600" : "bg-highlighted-color"} hover:opacity-80 transition-all duration-200 rounded-sm`}
          onClick={() => {
            setIsDropdownOpen((prev) => !prev);
          }}
          type="button"
        >
          Section {currentNumber} of {totalSections}{" "}
          <span
            className="text-base text-white transition-all duration-300"
            style={{
              rotate: isDropdownOpen ? "180deg" : "0deg",
            }}
          >
            <FaChevronDown />
          </span>
        </button>
        <div
          className="w-fit absolute top-[120%] right-0 max-md:right-auto max-md:left-0 grid transition-all duration-300 z-10 shadow-sm"
          style={{
            gridTemplateRows: isDropdownOpen ? "1fr" : "0fr",
          }}
        >
          <menu className="w-fit overflow-hidden bg-white rounded-sm flex flex-col">
            <li
              className={`w-full h-full px-4! py-2! text-base text-left hover:bg-highlighted-color/10 border-y border-gray-500/10 cursor-pointer ${currentField === "basic" ? "bg-highlighted-color/20" : ""} transition-all duration-200 `}
              onClick={() => {
                handleFieldChange("jump", "basic");
                setIsDropdownOpen(false);
              }}
            >
              {sectionNameMap["basic"]}
            </li>
            {sections.map((section) => (
              <li
                key={section}
                className={`w-full h-full px-4! py-2! text-base text-left hover:bg-highlighted-color/10 border-y border-gray-500/10 cursor-pointer ${currentField === section ? "bg-highlighted-color/20" : ""} transition-all duration-200 `}
                onClick={() => {
                  handleFieldChange("jump", section);
                  setIsDropdownOpen(false);
                }}
              >
                {sectionNameMap[section]}
              </li>
            ))}
            <li
              className={`w-full h-full px-4! py-2! text-base text-left hover:bg-highlighted-color/10 border-y border-gray-500/10 cursor-pointer ${currentField === "final" ? "bg-highlighted-color/20" : ""} transition-all duration-200 `}
              onClick={() => {
                handleFieldChange("jump", "final");
                setIsDropdownOpen(false);
              }}
            >
              {sectionNameMap["final"]}
            </li>
          </menu>
        </div>
      </div>
    </div>
  );
}
