import type { MemberTableData } from "@/types/member-types";
import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../table/table-column-header";
import capitalize from "@/utils/capitalize";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LuFacebook, LuGlobe } from "react-icons/lu";
import MemberEditDialog from "@/components/members/member-edit-dialog";
import TableActionColumn from "../table/table-action-column";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";

export default function getMembersTableColumns(): ColumnDef<MemberTableData>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <TableColumnHeader
          tId="members-table"
          column={column}
          label="Full Name"
        />
      ),
      cell: ({ row }) => (
        <div className="w-full h-full flex gap-2 items-center">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="font-medium  max-sm:text-sm flex flex-wrap">
              {row.original.name && row.original.name.split(" ").length > 1
                ? row.original.name.split(" ").map((part, index) => (
                    <span key={index} className="mr-1! leading-5.5">
                      {part}
                    </span>
                  ))
                : null}
            </p>
            <p className="text-xs text-gray-500 max-w-62.5">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
      meta: {
        label: "Full Name",
        placeholder: "Search names...",
        variant: "text",
      },
      enableColumnFilter: true,
      size: 270,
    },
    {
      id: "contactNumber",
      accessorKey: "contactNumber",
      header: ({ column }) => (
        <TableColumnHeader
          tId="members-table"
          column={column}
          label="Contact Number"
        />
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
        <TableColumnHeader tId="members-table" column={column} label="Batch" />
      ),
      meta: {
        label: "Batch",
        placeholder: "Batch...",
        variant: "number",
      },
      enableColumnFilter: true,
      size: 100,
    },
    {
      id: "branch",
      accessorKey: "branch",
      header: ({ column }) => (
        <TableColumnHeader tId="members-table" column={column} label="Branch" />
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
      size: 130,
    },
    {
      id: "position",
      accessorKey: "position",
      header: ({ column }) => (
        <TableColumnHeader
          tId="members-table"
          column={column}
          label="Position"
        />
      ),
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Tooltip title={row.original.position}>
            <span
              className={`px-2! py-1! rounded-xs text-xs font-medium max-w-[20ch] truncate ${
                row.original.position === "admin"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {capitalize(row.original.position)}{" "}
            </span>
          </Tooltip>
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
        <TableColumnHeader
          tId="members-table"
          column={column}
          label="Created At"
        />
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
        const hasRegistered14DaysAgo =
          dayjs().diff(dayjs(row.original.createdAt), "day") <= 14;

        return (
          <TableActionColumn
            tId="members-table"
            rowId={row.id}
            open={open}
            setOpen={setOpen}
            style={{
              background:
                row.original.new === true && hasRegistered14DaysAgo
                  ? "#dcfce7"
                  : "white",
            }}
          >
            <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
              <NavLink
                to={`/member/${row.original.slug}`}
                className="w-full h-full flex gap-2 rounded-sm items-center px-2.5! py-1.5! hover:bg-[#f5f5f5] transition-all cursor-pointer"
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
          </TableActionColumn>
        );
      },
      size: 40,
    },
  ];
}
