import type { MemberTableData } from "@/types/member-types";
import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../table-column-header";
import capitalize from "@/utils/capitalize";
import { useState } from "react";
import { Popover } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { LuEllipsisVertical } from "react-icons/lu";
import MemberEditDialog from "@/components/members/member-edit-dialog";

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
        placeholder: "Search names...",
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
        placeholder: "Search batches...",
        variant: "number",
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
        variant: "multiSelect",
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
        variant: "multiSelect",
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
      cell: ({ row }) => {
        const [open, setOpen] = useState<boolean>(false);
        const id = `popover-${row.id}`;

        return (
          <div>
            <button
              className={
                "flex gap-1.5 items-center px-3! py-1.5! hover:bg-secondary-bg/70 transition-all cursor-pointer" +
                row.original.new
                  ? " bg-green"
                  : ""
              }
              aria-describedby={id}
              onClick={() => setOpen(!open)}
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
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <div className="w-full h-full bg-secondary-bg/70 backdrop-blur-2xl border rounded-sm border-gray-300">
                <div className="flex flex-col p-1! border-b border-gray-300">
                  <NavLink
                    to={`/member/${row.original.slug}`}
                    className="px-2! py-1! hover:bg-secondary-bg/70 transition-all rounded-sm"
                    onClick={() => setOpen(false)}
                  >
                    View Profile
                  </NavLink>

                  <Link
                    to={row.original.socialLink || "#"}
                    className="px-2! py-1! hover:bg-secondary-bg/70 transition-all rounded-sm"
                    onClick={() => setOpen(false)}
                  >
                    Facebook
                  </Link>
                </div>
                <MemberEditDialog member={row.original} />
              </div>
            </Popover>
          </div>
        );
      },
      size: 40,
    },
  ];
}
