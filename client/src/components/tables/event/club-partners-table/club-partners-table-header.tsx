import type { ColumnDef } from "@tanstack/react-table";
import TableColumnHeader from "../../table/table-column-header";
import { useState } from "react";
import { LuFacebook, LuTrash2 } from "react-icons/lu";
import TableActionColumn from "../../table/table-action-column";
import { TableBtn } from "@/components/ui/btns";
import DeleteWarning from "@/components/ui/delete-warning";
import type { ClubPartnerTableData } from "@/types/event/club-partner-types";
import { Link } from "react-router";
import useClubPartnerMutation from "@/hooks/event-hooks/use-club-partner-mutation";
import ClubPartnerDetails from "./club-partner-details";

export default function getClubPartnersTableColumns(): ColumnDef<ClubPartnerTableData>[] {
  return [
    {
      id: "regName",
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
            <p className="text-xs text-gray-500 max-w-52.5 truncate">
              {row.original.code}
            </p>
          </div>
        </div>
      ),
      meta: {
        label: "Full Name",
      },
      enableColumnFilter: false,
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
              <ClubPartnerDetails
                clubPartnerId={row.original._id}
                setModelOpen={setOpen}
                previousModels={{
                  applications: [],
                  registrations: [],
                  teams: [],
                }}
              />

              <Link
                to={row.original.facebookUrl || "#"}
                className="w-full h-full flex gap-2 rounded-sm items-center px-2.5! py-1.5! hover:bg-[#f5f5f5] transition-all cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <LuFacebook className="opacity-70" />
                <p>Facebook</p>
              </Link>

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
      size: 40,
    },
  ];
}
