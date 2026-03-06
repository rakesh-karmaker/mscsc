import type { MessageTableData } from "@/types/message-types";
import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../table/table-column-header";
import { useState } from "react";
import TableActionColumn from "../table/table-action-column";
import { LuEye, LuTrash } from "react-icons/lu";

export default function getMessagesTableColumns({
  onViewClick,
  onDelete,
}: {
  onViewClick: (message: MessageTableData) => void;
  onDelete: (id: string) => void;
}): ColumnDef<MessageTableData>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Full Name" />
      ),
      meta: {
        label: "Full Name",
        placeholder: "Search names...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Email" />
      ),
      meta: {
        label: "Email",
        placeholder: "Search emails...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "source",
      accessorKey: "source",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Source" />
      ),
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span
            className={`px-2! py-1! rounded-xs text-xs font-medium ${
              row.original.source === "Main Website"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.source}
          </span>
        </div>
      ),
      meta: {
        label: "Source",
        placeholder: "Search source...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "subject",
      accessorKey: "subject",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Subject" />
      ),
      cell: ({ row }) => (
        <div className="max-w-sm">
          <div className="line-clamp-2">{row.original.subject}</div>
        </div>
      ),
      meta: {
        label: "Subject",
      },
      enableColumnFilter: false,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const [open, setOpen] = useState<boolean>(false);

        return (
          <TableActionColumn
            rowId={row.id}
            open={open}
            setOpen={setOpen}
            style={{
              background: row.original.new === true ? "#dcfce7" : "white",
            }}
          >
            <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
              <button
                className="w-full h-full flex gap-2 rounded-sm items-center px-2.5! py-1.5! hover:bg-[#f5f5f5] transition-all cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  onViewClick(row.original);
                }}
              >
                <LuEye className="opacity-70" />
                <p>View Profile</p>
              </button>

              <button
                className="w-full h-full flex gap-2 rounded-sm items-center px-2.5! py-1.5! hover:bg-[#f5f5f5] transition-all cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  onDelete(row.original._id);
                }}
              >
                <LuTrash className="opacity-70" />
                <p>Delete Message</p>
              </button>
            </div>
          </TableActionColumn>
        );
      },
      size: 40,
    },
  ];
}
