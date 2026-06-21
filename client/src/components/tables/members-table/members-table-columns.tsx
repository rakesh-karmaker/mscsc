import type { MemberTableData } from "@/types/member-types";
import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../table/table-column-header";
import capitalize from "@/utils/capitalize";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import LuFacebook from "~icons/lucide/facebook";
import LuGlobe from "~icons/lucide/globe";
import MemberEditDialog from "@/components/members/member-edit-dialog";
import TableActionColumn from "../table/table-action-column";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";
import {
  requireMinimumRole,
  ROLES,
  type Role,
} from "@/utils/require-minimum-role";

export default function getMembersTableColumns(
  role: Role,
): ColumnDef<MemberTableData>[] {
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
        <div className="w-full h-full flex gap-2 items-center min-w-fit">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div className="w-full flex flex-col">
            <p className="font-medium  max-sm:text-sm flex flex-wrap">
              {row.original.name && row.original.name.split(" ").length > 1
                ? row.original.name.split(" ").map((part, index) => (
                    <span key={index} className="mr-1! leading-5.5">
                      {part}
                    </span>
                  ))
                : null}
            </p>
            <p className="text-xs text-gray-500 max-w-56.5 truncate">
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
      size: 300,
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
      id: "role",
      accessorKey: "role",
      header: ({ column }) => (
        <TableColumnHeader tId="members-table" column={column} label="Role" />
      ),
      cell: ({ row }) => {
        function getRoleColor(role: Role) {
          switch (role) {
            case "admin":
              return "bg-red-100 text-red-800";
            case "editor":
              return "bg-yellow-100 text-yellow-800";
            case "observer":
              return "bg-gray-100 text-gray-800";
            case "executive":
              return "bg-blue-100 text-blue-800";
            default:
              return "bg-green-100 text-green-800";
          }
        }

        return (
          <div className="flex gap-1">
            {row.original.role !== ROLES.MEMBER && (
              <span
                className={`px-2! py-1! rounded-xs text-xs font-medium ${getRoleColor(row.original.role)}`}
              >
                {capitalize(row.original.role)}
              </span>
            )}
            <Tooltip title={row.original.position}>
              <span
                className={`px-2! py-1! rounded-xs text-xs font-medium max-w-[20ch] truncate bg-green-100 text-green-800`}
              >
                {capitalize(row.original.position)}{" "}
              </span>
            </Tooltip>
          </div>
        );
      },
      meta: {
        label: "Role",
        variant: "multiSelect",
        options: [
          ROLES.MEMBER,
          ROLES.EXECUTIVE,
          ROLES.OBSERVER,
          ROLES.EDITOR,
          ROLES.ADMIN,
        ].map((role) => ({
          label: capitalize(role),
          value: role,
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
            {requireMinimumRole(role, ROLES.EDITOR) && (
              <MemberEditDialog member={row.original} />
            )}
          </TableActionColumn>
        );
      },
      size: 40,
    },
  ];
}
