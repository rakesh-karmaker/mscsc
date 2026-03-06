import { Popover } from "@mui/material";
import {
  type Dispatch,
  type HTMLAttributes,
  type ReactNode,
  type SetStateAction,
} from "react";
import { LuEllipsisVertical } from "react-icons/lu";

interface TableActionColumnProps extends HTMLAttributes<HTMLButtonElement> {
  rowId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export default function TableActionColumn({
  rowId,
  children,
  open,
  setOpen,
  ...rest
}: TableActionColumnProps): ReactNode {
  const id = `popover-${rowId}`;

  return (
    <div>
      <button
        id={id}
        className={
          "flex gap-1.5 shadow-xs items-center w-8 h-8 rounded-sm justify-center hover:bg-[#f5f5f5]! transition-all cursor-pointer border border-black/10"
        }
        aria-describedby={id}
        onClick={() => setOpen(!open)}
        {...rest}
      >
        <LuEllipsisVertical />
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={document.getElementById(id)}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            boxShadow: "rgba(149, 157, 165, 0.1) 0px 8px 24px",
            marginTop: "4px",
          },
        }}
      >
        <div className="w-full h-full flex flex-col bg-primary-bg rounded-md border border-gray-300">
          {children}
        </div>
      </Popover>
    </div>
  );
}
