import type { EventTeamTableData } from "@/types/event/event-team-types";
import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../../table/table-column-header";
import capitalize from "@/utils/capitalize";
import { deSlugify } from "@/utils/de-slugify";
import { useState } from "react";
import useTeamMutation from "@/hooks/event-hooks/use-team-mutation";
import TableActionColumn from "../../table/table-action-column";
import ChangeStatus from "../change-status";
import TeamDetailsModel from "./team-details-model";
import { TableBtn } from "@/components/ui/btns";
import DeleteWarning from "@/components/ui/delete-warning";
import LuTrash2 from "~icons/lucide/trash-2";

export default function getTeamsTableColumns(
  segments: {
    segmentSlug: string;
    isTeamSegment: boolean;
    isPaidSegment: boolean;
    fees: number;
  }[],
): ColumnDef<EventTeamTableData>[] {
  return [
    {
      id: "teamName",
      accessorKey: "teamName",
      header: ({ column }) => (
        <TableColumnHeader tId="teams" column={column} label="Team Name" />
      ),
      cell: ({ row }) => (
        <div className="w-full h-full flex gap-2 items-center">
          <div className="flex flex-col">
            <p className="font-medium text-lg flex flex-wrap">
              {row.original.teamName &&
              row.original.teamName.split(" ").length > 1 ? (
                row.original.teamName.split(" ").map((part, index) => (
                  <span key={index} className="mr-1! leading-5.5">
                    {part}
                  </span>
                ))
              ) : (
                <span className="leading-5.5">{row.original.teamName}</span>
              )}
            </p>
            <p className="text-xs text-gray-500 max-w-52.5 truncate">
              {deSlugify(row.original.segmentSlug, false)}
            </p>
          </div>
        </div>
      ),
      meta: {
        label: "Team Name",
        placeholder: "Search team names...",
        variant: "text",
      },
      enableColumnFilter: true,
      size: 280,
    },
    {
      id: "teamStatus",
      accessorKey: "teamStatus",
      header: ({ column }) => (
        <TableColumnHeader tId="teams" column={column} label="Status" />
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
          label: capitalize(status),
          value: status,
        })),
      },
      enableColumnFilter: true,
      size: 130,
    },
    {
      id: "teamTransactionMethod",
      accessorKey: "teamTransactionMethod",
      header: ({ column }) => (
        <TableColumnHeader tId="teams" column={column} label="Method" />
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
            {row.original.isPaidSegment
              ? capitalize(row.original.transactionMethod || "other")
              : "N/A"}
          </span>
        );
      },
      meta: {
        label: "Transaction Method",
      },
      enableColumnFilter: false,
      size: 130,
    },
    {
      id: "teamSegments",
      accessorKey: "teamSegments",
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
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <TableColumnHeader tId="teams" column={column} label="Created" />
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
        label: "Created Date",
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const [open, setOpen] = useState(false);
        const [deleteOpen, setDeleteOpen] = useState(false);
        const teamMutation = useTeamMutation();

        return (
          <TableActionColumn
            tId="teams"
            rowId={row.id}
            open={open}
            setOpen={setOpen}
            style={{
              background: "white",
            }}
          >
            <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
              <ChangeStatus
                id={`change-status-details-${row.original._id}`}
                documentId={row.original._id}
                setOpen={() => {}}
                model="team"
                mutation={teamMutation}
              />

              <TeamDetailsModel
                teamId={row.original._id}
                setOpen={setOpen}
                previousModels={{
                  applications: [],
                  registrations: [],
                  teams: [row.original._id],
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
                    teamMutation.mutate({
                      method: "delete",
                      documentId: row.original._id,
                    });
                    setOpen(false);
                  }}
                  open={deleteOpen}
                  setOpen={setDeleteOpen}
                  title="Delete Team"
                >
                  This will permanently delete this team{" "}
                  <span className="font-semibold">{row.original.teamName}</span>{" "}
                  from the team's list and remove all of their data from the
                  server. All of their images, links, and other data will be
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
