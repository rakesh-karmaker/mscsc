import useRegistrationMutation from "@/hooks/event-hooks/use-registration-mutation";
import type { EventRegistrationDetails } from "@/types/event/event-registration-types";
import { useState, type ReactNode } from "react";
import ChangeStatus from "../change-status";
import { TableBtn } from "@/components/ui/btns";
import DeleteWarning from "@/components/ui/delete-warning";
import LuTrash2 from "~icons/lucide/trash-2";
import {
  requireMinimumRole,
  ROLES,
  type Role,
} from "@/utils/require-minimum-role";

export default function RegistrationActions({
  details,
  registrationId,
  setModelOpen,
  version,
  role,
}: {
  details: EventRegistrationDetails;
  registrationId: string;
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  version: "desktop" | "mobile";
  role: Role;
}): ReactNode {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const registrationMutation = useRegistrationMutation();

  if (!requireMinimumRole(role, ROLES.EDITOR)) {
    return null;
  }

  return (
    <div>
      <h3 className="text-2xl mb-1.75!">Registration Actions:</h3>
      <div className="flex flex-col gap-1"></div>
      <div className="w-full flex flex-wrap items-center gap-4">
        <ChangeStatus
          id={`change-status-details-${registrationId}-${version}`}
          documentId={registrationId}
          setOpen={() => {}}
          mutation={registrationMutation}
          className="max-w-fit bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200"
          insideModel={true}
        />
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
                registrationMutation.mutate({
                  method: "delete",
                  documentId: details._id,
                });
                setModelOpen(false);
              }}
              open={deleteOpen}
              setOpen={setDeleteOpen}
              title="Delete Registration"
            >
              This will permanently delete this registration{" "}
              <span className="font-semibold">{details.name}</span> from the
              registration's list and remove all of their data from the server.
              All of their images, links, and other data will be permanently
              lost.
            </DeleteWarning>
          </div>
        )}
      </div>
    </div>
  );
}
