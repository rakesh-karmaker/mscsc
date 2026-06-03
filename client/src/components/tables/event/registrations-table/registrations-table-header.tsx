import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../../table/table-column-header";
import capitalize from "@/utils/capitalize";
import { useState } from "react";
import LuCircleCheck from "~icons/lucide/circle-check";
import LuCircleX from "~icons/lucide/circle-x";
import LuTrash2 from "~icons/lucide/trash-2";
import TableActionColumn from "../../table/table-action-column";
import type { EventRegistrationTableData } from "@/types/event/event-registration-types";
import getCategory from "@/utils/get-category";
import { TableBtn } from "@/components/ui/btns";
import ChangeStatus from "../change-status";
import RegistrationDetailsModel from "./registration-details-model";
import DeleteWarning from "@/components/ui/delete-warning";
import useRegistrationMutation from "@/hooks/event-hooks/use-registration-mutation";
import { deSlugify } from "@/utils/de-slugify";

export default function getRegistrationsTableColumns(
  segments: {
    segmentSlug: string;
    isTeamSegment: boolean;
    isPaidSegment: boolean;
    fees: number;
  }[],
): ColumnDef<EventRegistrationTableData>[] {
  return [
    {
      id: "regName",
      accessorKey: "name",
      header: ({ column }) => (
        <TableColumnHeader
          tId="registrations"
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
              {row.original.name && row.original.name.split(" ").length > 1 ? (
                row.original.name.split(" ").map((part, index) => (
                  <span key={index} className="mr-1! leading-5.5">
                    {part}
                  </span>
                ))
              ) : (
                <span className="leading-5.5">{row.original.name}</span>
              )}
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
      id: "regCode",
      accessorKey: "code",
      header: ({ column }) => (
        <TableColumnHeader tId="registrations" column={column} label="Code" />
      ),
      cell: ({ row }) => (
        <span
          className={`font-mono ${row.original.status === "validated" ? "text-black" : "text-gray-400"}`}
        >
          {row.original.code ? row.original.code.toUpperCase() : "N/A"}
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
      id: "regStatus",
      accessorKey: "status",
      header: ({ column }) => (
        <TableColumnHeader tId="registrations" column={column} label="Status" />
      ),
      cell: ({ row }) => {
        let colorClasses = "";
        switch (row.original.status) {
          case "pending":
            colorClasses = "bg-yellow-100 text-yellow-800";
            break;
          case "validated":
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
        options: ["pending", "validated", "rejected"].map((status) => ({
          label: status,
          value: status,
        })),
      },
      enableColumnFilter: true,
      size: 130,
    },
    {
      id: "regHasAttended",
      accessorKey: "hasAttended",
      header: ({ column }) => (
        <TableColumnHeader
          tId="registrations"
          column={column}
          label="Attended"
        />
      ),
      cell: ({ row }) => (
        <span
          className={`px-2! py-1! rounded-xs text-xs font-medium ${
            row.original.hasAttended
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.hasAttended ? "Attended" : "Not Attended"}
        </span>
      ),
      meta: {
        label: "Attended",
      },
      enableColumnFilter: true,
      size: 130,
    },
    {
      id: "regSegments",
      accessorKey: "segments",
      header: ({ column }) => (
        <TableColumnHeader
          tId="registrations"
          column={column}
          label="Segments"
        />
      ),
      cell: ({ row }) => (
        <p>
          {row.original.segments && row.original.segments.length > 0
            ? row.original.segments.length
            : "N/A"}
        </p>
      ),
      meta: {
        label: "Segments",
        variant: "multiSelect",
        options: segments.map((segment) => ({
          label: deSlugify(segment.segmentSlug, false),
          value: segment.segmentSlug,
        })),
      },
      enableColumnFilter: true,
    },
    {
      id: "regPhoneNumber",
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <TableColumnHeader
          tId="registrations"
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
      id: "regCategory",
      accessorKey: "category",
      header: ({ column }) => (
        <TableColumnHeader
          tId="registrations"
          column={column}
          label="Category"
        />
      ),
      cell: ({ row }) => {
        let colorClasses = "";
        let category = getCategory(row.original.grade);
        switch (category) {
          case "primary":
            colorClasses = "bg-blue-100 text-blue-800";
            break;
          case "junior":
            colorClasses = "bg-green-100 text-green-800";
            break;
          case "secondary":
            colorClasses = "bg-yellow-100 text-yellow-800";
            break;
          case "higher secondary":
            colorClasses = "bg-purple-100 text-purple-800";
            break;
          default:
            colorClasses = "bg-gray-100 text-gray-800";
        }

        return (
          <span
            className={`px-2! py-1! rounded-xs text-xs font-medium ${colorClasses}`}
          >
            {capitalize(category)}
          </span>
        );
      },
      meta: {
        label: "Category",
        placeholder: "Category...",
        variant: "multiSelect",
        options: ["primary", "junior", "secondary", "higher secondary"].map(
          (category) => ({
            label: capitalize(category),
            value: category,
          }),
        ),
      },
      enableColumnFilter: false,
    },
    {
      id: "regTransactionMethod",
      accessorKey: "transactionMethod",
      header: ({ column }) => (
        <TableColumnHeader tId="registrations" column={column} label="Method" />
      ),
      cell: ({ row }) => {
        let colorClasses = "";
        switch (row.original.transactionMethod) {
          case "bkash":
            colorClasses = "bg-green-100 text-green-800";
            break;
          case "nagad":
            colorClasses = "bg-blue-100 text-blue-800";
            break;
          case "rocket":
            colorClasses = "bg-purple-100 text-purple-800";
            break;
          default:
            colorClasses = "bg-gray-100 text-gray-800";
        }
        return (
          <span
            className={`px-2! py-1! rounded-xs text-xs font-medium ${colorClasses}`}
          >
            {capitalize(row.original.transactionMethod)}
          </span>
        );
      },
      meta: {
        label: "Method",
        variant: "multiSelect",
        options: ["bkash", "nagad", "rocket"].map((method) => ({
          label: capitalize(method),
          value: method,
        })),
      },
      enableColumnFilter: true,
      size: 130,
    },
    {
      id: "regRegistrationDate",
      accessorKey: "registrationDate",
      header: ({ column }) => (
        <TableColumnHeader
          tId="registrations"
          column={column}
          label="Registered"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.registrationDate);
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
        label: "Registered Date",
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const [open, setOpen] = useState<boolean>(false);
        const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
        const registrationMutation = useRegistrationMutation();

        return (
          <TableActionColumn
            tId="registration"
            rowId={row.id}
            open={open}
            setOpen={setOpen}
            style={{
              background: "white",
            }}
          >
            <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
              <ChangeStatus
                documentId={row.original._id}
                id={`status-popover-${row.id}`}
                mutation={registrationMutation}
                setOpen={setOpen}
              />

              <TableBtn
                onClick={() => {
                  registrationMutation.mutate({
                    method: "toggleAttendance",
                    documentId: row.original._id,
                    data: { hasAttended: !row.original.hasAttended },
                  });
                  setOpen(false);
                }}
              >
                {" "}
                {row.original.hasAttended ? (
                  <LuCircleX className="opacity-70" />
                ) : (
                  <LuCircleCheck className="opacity-70" />
                )}
                <p>
                  Mark as{" "}
                  {row.original.hasAttended ? "Not Attended" : "Attended"}
                </p>
              </TableBtn>
              <RegistrationDetailsModel
                registrationId={row.original._id}
                setOpen={setOpen}
                previousModels={{
                  applications: [],
                  registrations: [row.original._id],
                  teams: [],
                }}
              />

              <div className="border-t border-gray-300">
                <TableBtn onClick={() => setDeleteOpen(true)}>
                  <LuTrash2 className="opacity-70" />
                  <p>Delete </p>
                </TableBtn>
                <DeleteWarning
                  slug={row.original._id}
                  deleteFunc={() => {
                    registrationMutation.mutate({
                      method: "delete",
                      documentId: row.original._id,
                    });
                  }}
                  open={deleteOpen}
                  setOpen={setDeleteOpen}
                  title="Delete Registration"
                >
                  This will permanently delete this registration{" "}
                  <span className="font-semibold">{row.original.name}</span>{" "}
                  from the registration's list and remove all of their data from
                  the server. All of their images, links, and other data will be
                  permanently lost.
                </DeleteWarning>
              </div>
            </div>
          </TableActionColumn>
        );
      },
      size: 40,
    },
  ];
}
