import FormSubmitBtn from "@/components/ui/form-submit-btn";
import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import FormErrorsModal from "./form-errors";

type FormSectionLayoutProps = {
  title: string;
  children: ReactNode;
  currentField: string;
  handleFieldChange: (method: "next" | "previous") => void;
  isEditMode: boolean;
  totalSections: number;
  currentNumber: number;
  errors: { [key: string]: any };
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
}: FormSectionLayoutProps): ReactNode {
  const [isViewingErrors, setIsViewingErrors] = useState(false);

  return (
    <section className="w-full h-full rounded-md border border-gray-400 flex flex-col gap-4 bg-third-level-bg/30">
      <div className="w-full flex justify-between gap-3 p-5! border-b border-gray-400 max-md:flex-col-reverse">
        <h2 className="w-full text-2xl max-w-full max-lg:text-xl font-semibold line-clamp-2">
          {title}
        </h2>
        <p
          className={`w-fit min-w-fit h-fit px-3! py-1.5! text-base font-medium text-white ${Object.keys(errors).length > 0 ? "bg-red-600" : "bg-highlighted-color"} rounded-sm`}
        >
          Section {currentNumber} of {totalSections}
        </p>
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
                onClick={() => handleFieldChange("previous")}
              >
                Previous
              </button>
            )}
            {currentField !== "final" && (
              <button
                type="button"
                className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit!"
                onClick={() => handleFieldChange("next")}
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
