import { Popover } from "@mui/material";
import type { Column } from "@tanstack/react-table";
import { useState, type ReactNode } from "react";
import {
  LuCheck,
  LuChevronDown,
  LuChevronsUpDown,
  LuChevronUp,
  LuEyeOff,
  LuX,
} from "react-icons/lu";

interface TableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLButtonElement> {
  column: Column<TData, TValue>;
  label: string;
}

export default function TableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...rest
}: TableColumnHeaderProps<TData, TValue>): ReactNode {
  const [open, setOpen] = useState<boolean>(false);

  const id = `popover-${column.id}`;

  function handleToggleSorting(sortDirection: "asc" | "desc" | "clear") {
    if (sortDirection === "asc") {
      column.toggleSorting(false);
    } else if (sortDirection === "desc") {
      column.toggleSorting(true);
    } else {
      column.clearSorting();
    }
    setOpen(false);
  }

  return (
    <div>
      <button
        className="flex gap-1.5 items-center px-3! py-1.5! hover:bg-[#f5f5f5] rounded-sm transition-all cursor-pointer"
        aria-describedby={id}
        id={id}
        onClick={() => setOpen(!open)}
        {...rest}
      >
        {label}
        {column.getCanSort() &&
          (column.getIsSorted() === "desc" ? (
            <LuChevronDown />
          ) : column.getIsSorted() === "asc" ? (
            <LuChevronUp />
          ) : (
            <LuChevronsUpDown />
          ))}
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={document.getElementById(id)}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            boxShadow: "rgba(149, 157, 165, 0.1) 0px 8px 24px",
            marginTop: "4px",
          },
        }}
      >
        <div className="w-full h-full flex flex-col bg-primary-bg rounded-md border border-gray-300">
          <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
            {column.getCanSort() && (
              <>
                <HeaderPopoverItem
                  checked={column.getIsSorted() === "asc"}
                  onClick={() => handleToggleSorting("asc")}
                >
                  <LuChevronUp />
                  Asc
                </HeaderPopoverItem>
                <HeaderPopoverItem
                  checked={column.getIsSorted() === "desc"}
                  onClick={() => handleToggleSorting("desc")}
                >
                  <LuChevronUp className="rotate-180" />
                  Desc
                </HeaderPopoverItem>
                {column.getIsSorted() && (
                  <HeaderPopoverItem
                    checked={false}
                    onClick={() => handleToggleSorting("clear")}
                  >
                    <LuX />
                    Reset
                  </HeaderPopoverItem>
                )}
              </>
            )}
            {column.getCanHide() && (
              <HeaderPopoverItem
                checked={!column.getIsVisible()}
                onClick={() => column.toggleVisibility()}
              >
                <LuEyeOff />
                Hide
              </HeaderPopoverItem>
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
}

function HeaderPopoverItem({
  checked,
  onClick,
  children,
}: {
  checked: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      className="w-full h-full flex gap-7 justify-between rounded-sm items-center px-1.5! py-1! hover:bg-[#f5f5f5] transition-all cursor-pointer"
      type="button"
      onClick={onClick}
    >
      <div className="w-full h-full flex gap-1 items-center">{children}</div>
      <p
        className="text-green-500 transition-opacity"
        style={{
          opacity: checked ? "100%" : "0%",
        }}
      >
        <LuCheck />
      </p>
    </button>
  );
}
