import { TableBtn } from "@/components/ui/btns";
import capitalize from "@/utils/capitalize";
import Popover from "@mui/material/Popover";
import { useState, type ReactNode } from "react";
import LuCircleCheck from "~icons/lucide/circle-check";
import LuCircleDashed from "~icons/lucide/circle-dashed";
import LuCircleX from "~icons/lucide/circle-x";

export interface ChangeClubPartnerStatusProps {
  id: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutation: any;
  documentId: string;
  className?: string;
  insideModel?: boolean;
}

export default function ChangeClubPartnerStatus({
  id,
  setOpen,
  mutation,
  documentId,
  className,
  insideModel,
}: ChangeClubPartnerStatusProps): ReactNode {
  const [statusPopoverOpen, setStatusPopoverOpen] = useState<boolean>(false);
  const statusIcons = {
    active: <LuCircleCheck className="opacity-70" />,
    inactive: <LuCircleX className="opacity-70" />,
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
          {Object.keys(statusIcons).map((status) => (
            <TableBtn
              key={status}
              onClick={() => {
                mutation.mutate({
                  method: "changeStatus",
                  clubPartnerId: documentId,
                  data: { status },
                });
                handleStatusClose();
              }}
            >
              {statusIcons[status as keyof typeof statusIcons]}
              <p>{capitalize(status)}</p>
            </TableBtn>
          ))}
        </div>
      </Popover>
    </div>
  );
}
