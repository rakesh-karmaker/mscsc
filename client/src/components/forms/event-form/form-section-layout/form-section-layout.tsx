import FormSubmitBtn from "@/components/ui/form-submit-btn";
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import FormErrorsModal from "../form-errors";
import FormSectionHeader from "./form-section-header";
import HideSectionSelect from "./hide-section-select";

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
  hiddenSections: string[];
  setHiddenSections: Dispatch<SetStateAction<string[]>>;
  isLoading: boolean;
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
  hiddenSections,
  setHiddenSections,
  isLoading,
}: FormSectionLayoutProps): ReactNode {
  const [isViewingErrors, setIsViewingErrors] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section className="w-full h-full rounded-md border max-sm:border-none border-gray-400 flex flex-col gap-4 bg-third-level-bg/30 max-sm:bg-primary-bg">
      <FormSectionHeader
        title={title}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        currentNumber={currentNumber}
        totalSections={totalSections}
        handleFieldChange={handleFieldChange}
        currentField={currentField}
        errors={errors}
        sections={sections}
      />

      <div className="w-full h-full p-5! max-sm:p-0! flex flex-col gap-5">
        <div className="w-full h-full flex flex-col gap-3">{children}</div>
        <HideSectionSelect
          hiddenSections={hiddenSections}
          setHiddenSections={setHiddenSections}
          section={currentField}
        />

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
                isLoading={isLoading}
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
