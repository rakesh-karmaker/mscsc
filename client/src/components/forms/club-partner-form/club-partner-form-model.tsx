import { Modal } from "@mui/material";
import type { ReactNode } from "react";
import { FaXmark } from "react-icons/fa6";
import ClubPartnerForm from "./club-partner-form";
import type { ClubPartnerFormData } from "@/lib/validation/club-partner-schema";

interface ClubPartnerFormModelProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setClubPartnerModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clubPartnerModelOpen: boolean;
  documentId?: string;
  defaultValues?: Omit<ClubPartnerFormData, "clubLogo"> & {
    clubLogoUrl?: string;
  };
}

export default function ClubPartnerFormModel({
  setOpen,
  setClubPartnerModelOpen,
  clubPartnerModelOpen,
  documentId,
  defaultValues,
}: ClubPartnerFormModelProps): ReactNode {
  const isEditMode = Boolean(defaultValues);

  return (
    <Modal
      open={clubPartnerModelOpen}
      onClose={() => setClubPartnerModelOpen(false)}
      aria-labelledby={isEditMode ? "Edit Club Partner" : "Add Club Partner"}
      aria-describedby={
        isEditMode
          ? "Edit the Club Partner for this application"
          : "Add a Club Partner for this application"
      }
      className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute max-sm:bg-primary-bg border-none! outline-none! focus-visible:outline-none"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="w-full max-w-[48.75em] max-md:max-w-[28.75em] max-sm:max-w-full max-sm:min-h-screen bg-primary-bg max-h-screen overflow-y-auto border-none! outline-none! focus-visible:outline-none rounded-lg">
        <div className="min-h-fit max-sm:max-h-full p-7! rounded-lg max-sm:rounded-none bg-primary-bg flex flex-col max-sm:justify-center gap-5">
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between items-start gap-4">
              <h2 className="text-2xl font-medium max-xs:text-2xl">
                {isEditMode ? "Edit Club Partner" : "Add Club Partner"}
              </h2>
              <button
                onClick={() => setClubPartnerModelOpen(false)}
                className="text-3xl transition-all duration-200 hover:text-red-400 cursor-pointer"
              >
                <FaXmark />
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-3!">
              {isEditMode
                ? "Edit the details of the club partner for this application. Leave a field empty if you don't want to change it."
                : "Provide the details of the club partner for this application. It is used to show the club partner's information and its registration details."}
            </p>
            <div className="w-full h-px bg-light-black/10 mt-2! mb-7!"></div>
            <ClubPartnerForm
              defaultValues={defaultValues}
              setOpen={setOpen}
              setClubPartnerModelOpen={setClubPartnerModelOpen}
              documentId={documentId}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
