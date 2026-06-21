import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../../table/table-column-header";
import capitalize from "@/utils/capitalize";
import { useState } from "react";
import LuFacebook from "~icons/lucide/facebook";
import LuTrash2 from "~icons/lucide/trash-2";
import TableActionColumn from "../../table/table-action-column";
import { TableBtn } from "@/components/ui/btns";
import ChangeStatus from "../change-status";
import DeleteWarning from "@/components/ui/delete-warning";
import type { CaApplicationTableData } from "@/types/event/ca-types";
import useCaApplicationMutation from "@/hooks/event-hooks/use-ca-application-mutation";
import ApplicationDetailsModel from "./application-details-model";
import {
  requireMinimumRole,
  ROLES,
  type Role,
} from "@/utils/require-minimum-role";

export default function getCaApplicationTableColumns(
  role: Role,
): ColumnDef<CaApplicationTableData>[] {
  return [
    {
      id: "position",
      header: () => (
        <span className="text-gray-500 text-center w-full pl-2.5!"># </span>
      ),
      cell: ({ row }) => (
        <span className="text-gray-500">{row.original.position}</span>
      ),
      enableColumnFilter: false,
      size: 20,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <TableColumnHeader
          tId="ca-applications"
          column={column}
          label="Full Name"
        />
      ),
      cell: ({ row }) => (
        <div className="w-full h-full flex gap-2 items-center">
          <img
            src={row.original.photoUrl}
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
            <p className="text-xs text-gray-500 max-w-52.5 truncate">
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
      size: 280,
    },
    {
      id: "caCode",
      accessorKey: "caCode",
      header: ({ column }) => (
        <TableColumnHeader tId="ca-applications" column={column} label="Code" />
      ),
      cell: ({ row }) => (
        <span
          className={`font-mono ${row.original.status === "approved" ? "text-black" : "text-gray-400"}`}
        >
          {row.original.caCode ? row.original.caCode.toUpperCase() : "N/A"}
        </span>
      ),
      meta: {
        label: "Code",
        placeholder: "Code...",
        variant: "text",
      },
      enableColumnFilter: true,
      size: 100,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <TableColumnHeader
          tId="ca-applications"
          column={column}
          label="Status"
        />
      ),
      cell: ({ row }) => {
        let colorClasses = "";
        switch (row.original.status) {
          case "pending":
            colorClasses = "bg-yellow-100 text-yellow-800";
            break;
          case "approved":
            colorClasses = "bg-green-100 text-green-800";
            break;
          case "rejected":
            colorClasses = "bg-red-100 text-red-800";
            break;
          default:
            colorClasses = "bg-gray-100 text-gray-800";
        }
        return (
          <span
            className={`px-2! py-1! rounded-xs text-xs font-medium ${colorClasses}`}
          >
            {capitalize(row.original.status)}
          </span>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: ["pending", "approved", "rejected"].map((status) => ({
          label: status,
          value: status,
        })),
      },
      enableColumnFilter: true,
      size: 130,
    },
    {
      id: "score",
      accessorKey: "score",
      header: ({ column }) => (
        <TableColumnHeader
          tId="ca-applications"
          column={column}
          label="Score"
        />
      ),
      cell: ({ row }) => (
        <span
          className={`px-2! py-1! rounded-xs text-xs font-medium bg-gray-100 text-gray-800`}
        >
          {row.original.score}
        </span>
      ),
      meta: {
        label: "Score",
      },
      enableColumnFilter: true,
      size: 100,
    },
    {
      id: "hasPreviousExperience",
      accessorKey: "hasPreviousExperience",
      header: ({ column }) => (
        <TableColumnHeader
          tId="ca-applications"
          column={column}
          label="Experienced"
        />
      ),
      cell: ({ row }) => (
        <span
          className={`px-2! py-1! rounded-xs text-xs font-medium ${
            row.original.hasPreviousExperience
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.hasPreviousExperience ? "Yes" : "No"}
        </span>
      ),
      meta: {
        label: "Experienced",
        variant: "select",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
      enableColumnFilter: true,
      size: 150,
    },
    {
      id: "phoneNumber",
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <TableColumnHeader
          tId="ca-applications"
          column={column}
          label="Phone Number"
        />
      ),
      meta: {
        label: "Phone Number",
      },
      enableColumnFilter: false,
    },
    {
      id: "applicationDate",
      accessorKey: "applicationDate",
      header: ({ column }) => (
        <TableColumnHeader
          tId="ca-applications"
          column={column}
          label="Applied"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.applicationDate);
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
        label: "Application Date",
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const [open, setOpen] = useState<boolean>(false);
        const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
        const caApplicationMutation = useCaApplicationMutation();

        return (
          <TableActionColumn
            tId="ca-applications"
            rowId={row.id}
            open={open}
            setOpen={setOpen}
            style={{
              background: "white",
            }}
          >
            <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
              <ApplicationDetailsModel
                applicationId={row.original._id}
                setOpen={setOpen}
                previousModels={{
                  applications: [row.original._id],
                  registrations: [],
                  teams: [],
                }}
              />

              {requireMinimumRole(role, ROLES.EDITOR) && (
                <ChangeStatus
                  documentId={row.original._id}
                  id={`status-popover-${row.id}`}
                  mutation={caApplicationMutation}
                  setOpen={setOpen}
                  model="application"
                />
              )}

              <a
                href={row.original.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex gap-2 rounded-sm items-center px-2.5! py-1.5! hover:bg-[#f5f5f5] transition-all cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <LuFacebook className="opacity-70" />
                <p>Facebook</p>
              </a>

              {requireMinimumRole(role, ROLES.ADMIN) && (
                <div className="border-t border-gray-300">
                  <TableBtn onClick={() => setDeleteOpen(true)}>
                    <LuTrash2 className="opacity-70" />
                    <p>Delete </p>
                  </TableBtn>
                  <DeleteWarning
                    slug={row.original._id}
                    deleteFunc={() => {
                      caApplicationMutation.mutate({
                        method: "delete",
                        documentId: row.original._id,
                      });
                    }}
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    title="Delete Application"
                  >
                    This will permanently delete this Application{" "}
                    <span className="font-semibold">{row.original.name}</span>{" "}
                    from the Application's list and remove all of their data
                    from the server. All of their images, links, and other data
                    will be permanently lost.
                  </DeleteWarning>
                </div>
              )}
            </div>
          </TableActionColumn>
        );
      },
      size: 40,
    },
  ];
}
