import { TableBtn } from "@/components/ui/btns";
import Modal from "@mui/material/Modal";
import { useState, type ReactNode } from "react";
import { FaXmark } from "react-icons/fa6";
import { LuCircleUserRound } from "react-icons/lu";
import ApplicationDetails from "./application-details";

interface ApplicationDetailsModelProps {
  applicationId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: ReactNode;
  className?: string;
  previousModels: {
    applications: string[];
    registrations: string[];
    teams: string[];
  };
}

export default function ApplicationDetailsModel({
  applicationId,
  setOpen,
  children = false,
  className = "",
  previousModels,
}: ApplicationDetailsModelProps): ReactNode {
  const [detailsModelOpen, setDetailsModelOpen] = useState<boolean>(false);
  function handleClose() {
    setDetailsModelOpen(false);
    setOpen(false);
  }

  return (
    <div>
      {children ? (
        <TableBtn
          onClick={(e) => {
            e.stopPropagation();
            setDetailsModelOpen(true);
          }}
          className={className}
        >
          {children}
        </TableBtn>
      ) : (
        <TableBtn
          onClick={(e) => {
            e.stopPropagation();
            setDetailsModelOpen(true);
          }}
          className={className}
        >
          <LuCircleUserRound className="opacity-70" />
          <p>View Details</p>
        </TableBtn>
      )}

      <Modal
        open={detailsModelOpen}
        onClose={() => handleClose()}
        aria-labelledby="Member Edit Box"
        aria-describedby="Edit Member Details"
        className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute max-sm:bg-primary-bg border-none! outline-none! focus-visible:outline-none"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="w-full max-w-[48.75em] max-md:max-w-[28.75em] max-sm:max-w-full max-sm:min-h-screen bg-primary-bg max-h-[90vh] max-sm:max-h-screen overflow-y-auto border-none! outline-none! focus-visible:outline-none rounded-lg">
          <div className="min-h-fit max-sm:max-h-full p-7! max-sm:p-[calc((100vw-var(--max-elements-width))/2)]! rounded-lg max-sm:rounded-none bg-primary-bg flex flex-col max-sm:justify-center gap-5">
            <div className="w-full flex flex-col">
              <div className="w-full flex justify-between items-start gap-4">
                <h2 className="text-2xl font-medium max-xs:text-2xl">
                  Application Details
                </h2>
                <button
                  onClick={() => handleClose()}
                  className="text-3xl transition-all duration-200 hover:text-red-400 cursor-pointer"
                >
                  <FaXmark />
                </button>
              </div>
              <div className="w-full h-px bg-light-black/10 mt-2! mb-7!"></div>
              <ApplicationDetails
                applicationId={applicationId}
                setModelOpen={setDetailsModelOpen}
                previousModels={previousModels}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
