import FormSubmitBtn from "@/components/ui/form-submit-btn";
import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import FormErrorsModal from "./form-errors";
import { sectionsTitle } from "@/services/data/event-form-data";
import { FaChevronDown } from "react-icons/fa";

type FormSectionLayoutProps = {
  title: string;
  children: ReactNode;
  currentField: string;
  handleFieldChange: (
    method: "next" | "previous" | "jump",
    jumpToField?: string,
  ) => void;
  isEditMode: boolean;
  totalSections: number;
  currentNumber: number;
  errors: { [key: string]: any };
  sections: string[];
};

export default function FormSectionLayout({
  title,
  children,
  currentField,
  handleFieldChange,
  isEditMode,
  totalSections,
  currentNumber,
  errors,
  sections,
}: FormSectionLayoutProps): ReactNode {
  const [isViewingErrors, setIsViewingErrors] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { basic, ...rest } = sectionsTitle;
  const sectionNameMap: { [key: string]: string } = {
    basic: "Basic Information",
    ...rest,
  };

  return (
    <section className="w-full h-full rounded-md border border-gray-400 flex flex-col gap-4 bg-third-level-bg/30">
      <div className="w-full flex justify-between gap-3 p-5! border-b border-gray-400 max-md:flex-col-reverse">
        <h2 className="w-full text-2xl max-w-full max-lg:text-xl font-semibold line-clamp-2">
          {title}
        </h2>
        <div className="w-full h-full relative flex justify-end">
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
            className="w-fit absolute top-[120%] right-0 grid transition-all duration-300 z-10 shadow-sm"
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
      <div className="w-full h-full p-5! flex flex-col gap-5">
        <div className="w-full h-full flex flex-col gap-3">{children}</div>

        <div className="w-full h-full flex justify-between items-center">
          {Object.keys(errors).length > 0 ? (
            <button
              type="button"
              className="primary-button w-fit! min-w-fit! px-6! py-2! text-base! font-normal! h-fit! before:bg-red-600! flex items-center gap-2!"
              onClick={() => setIsViewingErrors((prev) => !prev)}
            >
              <IoWarning className="text-[1.1rem] -ml-1!" /> View Errors
            </button>
          ) : null}
          <div className="w-full full flex justify-end gap-3">
            {currentField !== "basic" && (
              <button
                type="button"
                className="primary-button w-fit! min-w-fit! px-6! py-2! text-base! font-normal! h-fit! before:bg-highlighted-color/20! text-black! hover:text-white!"
                onClick={() => {
                  handleFieldChange("previous");
                  setIsDropdownOpen(false);
                }}
              >
                Previous
              </button>
            )}
            {currentField !== "final" && (
              <button
                type="button"
                className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit!"
                onClick={() => {
                  handleFieldChange("next");
                  setIsDropdownOpen(false);
                }}
              >
                Next
              </button>
            )}
            {currentField === "final" && (
              <FormSubmitBtn
                isLoading={false}
                pendingText={
                  isEditMode ? "Updating Event..." : "Creating Event..."
                }
                className="w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit!"
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (Object.keys(errors).length > 0) {
                    toast.error(
                      "Please fix the errors in the form before submitting.",
                    );
                  }
                }}
              >
                {isEditMode ? "Update Event" : "Create Event"}
              </FormSubmitBtn>
            )}
          </div>
        </div>
      </div>
      <FormErrorsModal
        errors={errors}
        open={isViewingErrors}
        setOpen={setIsViewingErrors}
      />
    </section>
  );
}
