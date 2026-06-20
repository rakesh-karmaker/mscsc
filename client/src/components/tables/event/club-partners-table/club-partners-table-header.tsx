import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../../table/table-column-header";
import { useState } from "react";
import LuCircleCheck from "~icons/lucide/circle-check";
import LuCircleX from "~icons/lucide/circle-x";
import LuCopy from "~icons/lucide/copy";
import LuTrash2 from "~icons/lucide/trash-2";
import TableActionColumn from "../../table/table-action-column";
import { TableBtn } from "@/components/ui/btns";
import DeleteWarning from "@/components/ui/delete-warning";
import type { ClubPartnerTableData } from "@/types/event/club-partner-types";
import useClubPartnerMutation from "@/hooks/event-hooks/use-club-partner-mutation";
import ChangeClubPartnerStatus from "./change-club-partner-status";
import ClubPartnerModel from "./club-partner-model";
import toast from "react-hot-toast";
import { EVENT_WEBSITE_URL } from "@/config/constants";

export default function getClubPartnersTableColumns(
  eventSlug: string,
): ColumnDef<ClubPartnerTableData>[] {
  return [
    {
      id: "position",
      header: () => (
        <span className="text-gray-500 text-center w-full pl-2.5!">
          Position{" "}
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-gray-500">{row.original.position}</span>
      ),
      enableColumnFilter: false,
      size: 20,
    },
    {
      id: "clubName",
      accessorKey: "name",
      header: ({ column }) => (
        <TableColumnHeader
          tId="clubPartners"
          column={column}
          label="Full Name"
        />
      ),
      cell: ({ row }) => (
        <div className="w-full h-full flex gap-2 items-center">
          <img
            src={row.original.clubLogoUrl}
            alt={row.original.clubName}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="font-medium  max-sm:text-sm flex flex-wrap">
              {row.original.clubName &&
              row.original.clubName.split(" ").length > 1 ? (
                row.original.clubName.split(" ").map((part, index) => (
                  <span key={index} className="mr-1! leading-5.5">
                    {part}
                  </span>
                ))
              ) : (
                <span className="leading-5.5">{row.original.clubName}</span>
              )}
            </p>
            <div className="text-xs text-gray-500 max-w-52.5 truncate flex items-center gap-1">
              <p>{row.original.code}</p>{" "}
              {row.original.status === "active" ? (
                <div className="bg-green-100 text-green-800 text-xs p-0.75! rounded-full">
                  <LuCircleCheck className="opacity-70 " />
                </div>
              ) : (
                <div className="bg-red-100 text-red-800 text-xs p-0.75! rounded-full">
                  <LuCircleX className="opacity-70" />
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      meta: {
        label: "Full Name",
        variant: "text",
        placeholder: "Search by name...",
      },
      enableColumnFilter: true,
      size: 280,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const [open, setOpen] = useState<boolean>(false);
        const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
        const clubPartnerMutation = useClubPartnerMutation();

        return (
          <TableActionColumn
            tId="clubPartners"
            rowId={row.id}
            open={open}
            setOpen={setOpen}
            style={{
              background: "white",
            }}
          >
            <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
              <ClubPartnerModel
                clubPartnerId={row.original._id}
                setOpen={setOpen}
                previousModels={{
                  applications: [],
                  registrations: [],
                  teams: [],
                }}
              />

              <ChangeClubPartnerStatus
                id={`change-status-details-${row.original._id}`}
                documentId={row.original._id}
                setOpen={() => {}}
                mutation={clubPartnerMutation}
              />

              <TableBtn
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${EVENT_WEBSITE_URL}/${eventSlug}/registration/?club-ref=${row.original.code}`,
                  );
                  toast.success("Registration URL copied to clipboard");
                  setOpen(false);
                }}
              >
                <LuCopy className="opacity-70" />
                <p>Copy Url</p>
              </TableBtn>

              <div className="border-t border-gray-300">
                <TableBtn onClick={() => setDeleteOpen(true)}>
                  <LuTrash2 className="opacity-70" />
                  <p>Delete</p>
                </TableBtn>
                <DeleteWarning
                  slug={row.original._id}
                  deleteFunc={() => {
                    clubPartnerMutation.mutate({
                      method: "delete",
                      clubPartnerId: row.original._id,
                    });
                    setOpen(false);
                  }}
                  open={deleteOpen}
                  setOpen={setDeleteOpen}
                  title="Delete Club Partner"
                >
                  This will permanently delete this club partner{" "}
                  <span className="font-semibold">{row.original.clubName}</span>{" "}
                  from the club partners' list and remove all of their data from
                  the server. All of their images, links, and other data will be
                  permanently lost.
                </DeleteWarning>
              </div>
            </div>
          </TableActionColumn>
        );
      },
      size: 32,
    },
  ];
}
