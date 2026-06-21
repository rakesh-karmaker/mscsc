import { useState, type ReactNode } from "react";
import ChangeStatus from "../change-status";
import useTeamMutation from "@/hooks/event-hooks/use-team-mutation";
import LuTrash2 from "~icons/lucide/trash-2";
import type { EventTeamData } from "@/types/event/event-team-types";
import { TableBtn } from "@/components/ui/btns";
import DeleteWarning from "@/components/ui/delete-warning";
import {
  requireMinimumRole,
  ROLES,
  type Role,
} from "@/utils/require-minimum-role";

export default function TeamActions({
  details,
  setModelOpen,
  previousModels,
  role,
}: {
  details: EventTeamData;
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  previousModels: {
    applications: string[];
    registrations: string[];
    teams: string[];
  };
  role: Role;
}): ReactNode {
  const teamMutation = useTeamMutation(previousModels);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!requireMinimumRole(role, ROLES.EDITOR)) {
    return null;
  }

  return (
    <div className="mt-2!">
      <h3 className="text-xl mb-1!">Actions:</h3>
      <div className="flex flex-col gap-1"></div>
      <div className="w-full flex flex-wrap items-center gap-4">
        {details.status !== "rejected" && (
          <ChangeStatus
            id={`change-status-details-${details._id}`}
            documentId={details._id}
            setOpen={() => {}}
            model="team"
            mutation={teamMutation}
            insideModel={true}
            className="max-w-fit bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200"
          />
        )}
        {requireMinimumRole(role, ROLES.ADMIN) && (
          <div>
            <TableBtn
              className="max-w-fit bg-red-500 text-white hover:bg-secondary-bg/20 border hover:text-black border-red-500/20 transition-all duration-200"
              aria-label="Delete this data"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setDeleteOpen(true);
              }}
            >
              <LuTrash2 className="opacity-70" />
              <p>Delete </p>
            </TableBtn>
            <DeleteWarning
              slug={details._id}
              deleteFunc={() => {
                teamMutation.mutate({
                  method: "delete",
                  documentId: details._id,
                });
                setModelOpen(false);
              }}
              open={deleteOpen}
              setOpen={setDeleteOpen}
              title="Delete Team"
            >
              This will permanently delete this team{" "}
              <span className="font-semibold">{details.teamName}</span> from the
              team's list and remove all of their data from the server. All of
              their images, links, and other data will be permanently lost.
            </DeleteWarning>
          </div>
        )}
      </div>
    </div>
  );
}
