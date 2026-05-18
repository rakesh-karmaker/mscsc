import { useState, type ReactNode } from "react";
import type { ChangeStatusProps } from "../change-status";
import { TableBtn } from "@/components/ui/btns";
import CaCodeModel from "./ca-code-model";

export default function ApproveStatus({
  setOpen,
  mutation,
  documentId,
  icon,
}: Omit<
  ChangeStatusProps & { icon: ReactNode; isCa: boolean },
  "id"
>): ReactNode {
  const [approveModelOpen, setApproveModelOpen] = useState<boolean>(false);

  return (
    <div>
      <TableBtn
        onClick={(e) => {
          e.stopPropagation();
          setApproveModelOpen(true);
        }}
      >
        {icon}
        <p>Approve</p>
      </TableBtn>

      <CaCodeModel
        setOpen={setOpen}
        mutation={mutation}
        documentId={documentId}
        caCodeModelOpen={approveModelOpen}
        setCaCodeModelOpen={setApproveModelOpen}
      />
    </div>
  );
}
