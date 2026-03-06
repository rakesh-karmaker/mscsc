import type { MemberTableData } from "@/types/member-types";
import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../table/table-column-header";
import capitalize from "@/utils/capitalize";
import { useState } from "react";
import { Popover } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { LuEllipsisVertical, LuFacebook, LuGlobe } from "react-icons/lu";
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
            className="w-11 h-11 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="font-medium truncate max-sm:text-sm">
              {row.original.name}
            </p>
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
      id: "contactNumber",
      accessorKey: "contactNumber",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Contact Number" />
      ),
      meta: {
        label: "Contact Number",
      },
      enableColumnFilter: false,
    },
    {
      id: "batch",
      accessorKey: "batch",
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Batch" />
      ),
      meta: {
        label: "Batch",
        placeholder: "Batch...",
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
        <div className="flex gap-1">
          <span
            className={`px-2! py-1! rounded-xs text-xs font-medium ${
              row.original.position === "admin"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {capitalize(row.original.position)}{" "}
          </span>
          {row.original.role !== "member" && (
            <span className="px-2! py-1! rounded-xs text-xs font-medium bg-blue-100 text-blue-800">
              {capitalize(row.original.role)}
            </span>
          )}
        </div>
      ),
      meta: {
        label: "Position",
        variant: "select",
        options: ["member", "executive", "admin"].map((position) => ({
          label: capitalize(position),
          value: position,
        })),
      },
      enableColumnFilter: true,
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
      meta: {
        label: "Created At",
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
              id={id}
              className={
                "flex gap-1.5 shadow-xs items-center w-8 h-8 rounded-sm justify-center hover:bg-[#f5f5f5]! transition-all cursor-pointer border border-black/10"
              }
              style={{
                background: row.original.new === true ? "#dcfce7" : "white",
              }}
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
                <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
                  <NavLink
                    to={`/member/${row.original.slug}`}
                    className="w-full h-full flex gap-2 justify-between rounded-sm items-center px-2.5! py-1.5! hover:bg-[#f5f5f5] transition-all cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    <LuGlobe className="opacity-70" />
                    <p>View Profile</p>
                  </NavLink>

                  <Link
                    to={row.original.socialLink || "#"}
                    className="w-full h-full flex gap-2 rounded-sm items-center px-2.5! py-1.5! hover:bg-[#f5f5f5] transition-all cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    <LuFacebook className="opacity-70" />
                    <p>Facebook</p>
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
