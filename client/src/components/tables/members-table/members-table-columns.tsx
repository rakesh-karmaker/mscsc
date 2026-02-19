import type { MemberTableData } from "@/types/member-types";
import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../table-column-header";
import capitalize from "@/utils/capitalize";

export default function getMembersTableColumns(): ColumnDef<MemberTableData>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Full Name" />
      ),
      cell: ({ row }) => (
        <div className="w-full h-full flex gap-2 items-center">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium">{row.getValue("name")}</p>
            <p className="text-xs text-gray-500">{row.original.email}</p>
          </div>
        </div>
      ),
      meta: {
        label: "Full Name",
        placeHolder: "Search names...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "batch",
      accessorKey: "batch",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Batch" />
      ),
      meta: {
        label: "Batch",
        placeHolder: "Search batches...",
        variant: "text",
        isNumeric: true,
      },
      enableColumnFilter: true,
    },
    {
      id: "branch",
      accessorKey: "branch",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Branch" />
      ),
      meta: {
        label: "Branch",
        variant: "multiselect",
        options: [
          "Main Boys",
          "Main Girls",
          "Branch - 1",
          "Branch - 2",
          "Branch - 3",
        ].map((branch) => ({ label: branch, value: branch })),
      },
      enableColumnFilter: true,
    },
    {
      id: "position",
      accessorKey: "position",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Position" />
      ),
      cell: ({ row }) => (
        <>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              row.original.position === "admin"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {capitalize(row.original.position)}{" "}
          </span>
          {row.original.role !== "member" && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {capitalize(row.original.role)}
            </span>
          )}
        </>
      ),
      meta: {
        label: "Position",
        variant: "multiselect",
        options: ["member", "executive", "admin"].map((position) => ({
          label: capitalize(position),
          value: position,
        })),
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Created At" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <span>
            {date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {},
      size: 40,
    },
  ];
}
