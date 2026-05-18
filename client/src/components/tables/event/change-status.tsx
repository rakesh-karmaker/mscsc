import { TableBtn } from "@/components/ui/btns";
import capitalize from "@/utils/capitalize";
import { Modal, TextField } from "@mui/material";
import Popover from "@mui/material/Popover";
import { Activity, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { FaXmark } from "react-icons/fa6";
import {
  LuCircleCheck,
  LuCircleDashed,
  LuCircleX,
  LuTimer,
} from "react-icons/lu";
import ApproveStatus from "./ca-table/approve-status";

export interface ChangeStatusProps {
  id: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutation: any;
  documentId: string;
  className?: string;
  insideModel?: boolean;
  isCa?: boolean;
}

export default function ChangeStatus({
  id,
  setOpen,
  mutation,
  documentId,
  className,
  insideModel,
  isCa = false,
}: ChangeStatusProps): ReactNode {
  const [statusPopoverOpen, setStatusPopoverOpen] = useState<boolean>(false);
  const statusIcons = {
    pending: <LuTimer className="opacity-70" />,
    validated: <LuCircleCheck className="opacity-70" />,
    rejected: <LuCircleX className="opacity-70" />,
  };

  function handleStatusClose() {
    setStatusPopoverOpen(false);
    setOpen(false);
  }
  return (
    <div>
      <TableBtn
        id={id}
        onClick={() => setStatusPopoverOpen(!statusPopoverOpen)}
        className={className}
      >
        <LuCircleDashed className="opacity-70" />
        <p>Change Status</p>
      </TableBtn>
      <Popover
        id={id}
        open={statusPopoverOpen}
        anchorEl={document.getElementById(id)}
        onClose={() => handleStatusClose()}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: insideModel ? "bottom" : "top",
          horizontal: insideModel ? "left" : "right",
        }}
        PaperProps={{
          style: {
            boxShadow: "rgba(149, 157, 165, 0.1) 0px 8px 24px",
            translate: insideModel ? "" : "-4px -4px",
          },
        }}
      >
        <div className="w-full h-full flex flex-col bg-primary-bg rounded-md border border-gray-300">
          {Object.keys(statusIcons)
            .slice(0, isCa ? 1 : 2)
            .map((status) => (
              <TableBtn
                key={status}
                onClick={() => {
                  mutation.mutate({
                    method: "changeStatus",
                    documentId: documentId,
                    data: { status },
                  });
                  handleStatusClose();
                }}
              >
                {statusIcons[status as keyof typeof statusIcons]}
                <p>{capitalize(status)}</p>
              </TableBtn>
            ))}

          <Activity mode={isCa ? "visible" : "hidden"}>
            <ApproveStatus
              setOpen={setOpen}
              mutation={mutation}
              documentId={documentId}
              icon={statusIcons["validated" as keyof typeof statusIcons]}
              isCa={isCa}
            />
          </Activity>

          <RejectStatus
            setOpen={setOpen}
            mutation={mutation}
            documentId={documentId}
            icon={statusIcons["rejected" as keyof typeof statusIcons]}
            id={id}
            isCa={isCa}
          />
        </div>
      </Popover>
    </div>
  );
}

function RejectStatus({
  setOpen,
  mutation,
  documentId,
  icon,
  isCa = false,
}: ChangeStatusProps & { icon: ReactNode; isCa: boolean }): ReactNode {
  const [rejectModelOpen, setRejectModelOpen] = useState<boolean>(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      reason: "",
    },
  });

  function onSubmit(data: { reason: string }) {
    mutation.mutate({
      method: "changeStatus",
      documentId: documentId,
      data: { status: "rejected", rejectionReason: data.reason },
    });
    setRejectModelOpen(false);
    setOpen(false);
  }

  return (
    <div>
      <TableBtn
        onClick={(e) => {
          e.stopPropagation();
          setRejectModelOpen(true);
        }}
      >
        {icon}
        <p>Reject</p>
      </TableBtn>

      <Modal
        open={rejectModelOpen}
        onClose={() => setRejectModelOpen(false)}
        aria-labelledby={"Reject Registration"}
        aria-describedby={"Provide a reason for rejecting this registration"}
        className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute max-sm:bg-primary-bg border-none! outline-none! focus-visible:outline-none"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="w-full max-w-[28.75em] max-sm:max-w-full max-sm:min-h-screen bg-primary-bg max-h-screen overflow-y-auto border-none! outline-none! focus-visible:outline-none rounded-lg">
          <div className="min-h-fit max-sm:max-h-full p-7! rounded-lg max-sm:rounded-none bg-primary-bg flex flex-col max-sm:justify-center gap-5">
            <div className="w-full flex flex-col">
              <div className="w-full flex justify-between items-start gap-4">
                <h2 className="text-2xl font-medium max-xs:text-2xl">
                  Reject {isCa ? "Application" : "Registration"}
                </h2>
                <button
                  onClick={() => setRejectModelOpen(false)}
                  className="text-3xl transition-all duration-200 hover:text-red-400 cursor-pointer"
                >
                  <FaXmark />
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-3!">
                Give a reason for rejecting this{" "}
                {isCa ? "application" : "registration"} to let the member know.
                This will be sent to the member via email and will be visible in
                the {isCa ? "application" : "registration"} details.
              </p>
              <div className="w-full h-px bg-light-black/10 mt-2! mb-7!"></div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                  <TextField
                    label="Reason for rejection"
                    multiline
                    rows={4}
                    {...register("reason", { required: true })}
                  />
                  <button
                    type="submit"
                    className="danger-button primary-button text-[1em]! py-1.75! px-3.5! w-fit! h-fit!"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Reject {isCa ? "Application" : "Registration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
