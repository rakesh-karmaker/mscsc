import { Modal } from "@mui/material";
import { FaXmark } from "react-icons/fa6";

export const DeleteWarning = ({
  id,
  deleteFunc,
  open,
  setOpen,
  children,
  ...rest
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="delete modal"
      aria-describedby="confirm delete dialog"
      className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute max-sm:bg-primary-bg !border-none !outline-none focus-visible:outline-none"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="w-full max-w-[28.75em] max-sm:max-w-full max-sm:min-h-screen bg-primary-bg max-h-screen overflow-y-auto !border-none !outline-none focus-visible:outline-none rounded-lg">
        <div className="min-h-fit max-sm:max-h-full !p-7 flex flex-col max-xs:justify-center gap-3 relative">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center gap-3">
              <h2 className="text-xl font-semibold">
                {rest?.title ?? "Delete"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl transition-all duration-200 hover:text-red-400 cursor-pointer"
                aria-label="Close Delete Dialog"
              >
                <FaXmark />
              </button>
            </div>
            <div className="w-full h-[1px] bg-light-black/10 !mb-2"></div>
            <p className="text-gray text-sm">
              {children
                ? children
                : "Are you sure you want to delete this item?"}
            </p>
            <p className="bg-red-100 text-red !p-2.5 border-[1px] border-red rounded-md text-sm font-medium">
              Warning: This action cannot be undone
            </p>
            <div className="w-full flex gap-2.5 justify-end items-center !mt-2">
              <button
                className="primary-button !text-[1em] !py-[7px] !px-[15px] !w-fit !h-fit"
                onClick={() => setOpen(false)}
                type="button"
                aria-label="Cancel Delete"
              >
                Cancel
              </button>
              <button
                className="danger-button primary-button !text-[1em] !py-[7px] !px-[15px] !w-fit !h-fit"
                type="button"
                aria-label="Confirm Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  deleteFunc(rest?.slug ?? id);
                  setOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
