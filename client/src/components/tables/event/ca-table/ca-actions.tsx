import LuTrash2 from "~icons/lucide/trash-2";
import ChangeStatus from "../change-status";
import DeleteWarning from "@/components/ui/delete-warning";
import { TableBtn } from "@/components/ui/btns";
import useCaApplicationMutation from "@/hooks/event-hooks/use-ca-application-mutation";
import CaCodeModel from "./ca-code-model";
import type { CaApplicationDetails } from "@/types/event/ca-types";
import { useState, type ReactNode } from "react";
import {
  requireMinimumRole,
  ROLES,
  type Role,
} from "@/utils/require-minimum-role";

export default function ApplicationActions({
  details,
  applicationId,
  setModelOpen,
  version,
  role,
}: {
  details: CaApplicationDetails;
  applicationId: string;
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  version: "desktop" | "mobile";
  role: Role;
}): ReactNode {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editModelOpen, setEditModelOpen] = useState(false);
  const applicationMutation = useCaApplicationMutation();

  if (!requireMinimumRole(role, ROLES.EDITOR)) {
    return null;
  }

  return (
    <div className="col-span-2 max-md:col-span-1">
      <h3 className="text-2xl mb-1.75!">Application Actions:</h3>
      <div className="flex flex-col gap-1"></div>
      <div className="w-full flex flex-wrap items-center gap-4">
        <ChangeStatus
          id={`change-status-details-${applicationId}-${version}`}
          documentId={applicationId}
          setOpen={() => {}}
          mutation={applicationMutation}
          className="max-w-fit bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200"
          insideModel={true}
          model="application"
        />
        {details.status === "approved" &&
          details.caCode &&
          details.caCode !== "N/A" && (
            <div>
              <TableBtn
                className="max-w-fit bg-gray-500 text-white hover:bg-secondary-bg/20 border hover:text-black border-gray-500/20 transition-all duration-200"
                aria-label="Delete this data"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditModelOpen(true);
                }}
              >
                <p>Edit CA Code</p>
              </TableBtn>

              <CaCodeModel
                setOpen={setModelOpen}
                mutation={applicationMutation}
                documentId={details._id}
                caCodeModelOpen={editModelOpen}
                setCaCodeModelOpen={setEditModelOpen}
                defaultCode={details.caCode || ""}
              />
            </div>
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
                applicationMutation.mutate({
                  method: "delete",
                  documentId: details._id,
                });
                setModelOpen(false);
              }}
              open={deleteOpen}
              setOpen={setDeleteOpen}
              title="Delete Application"
            >
              This will permanently delete this application{" "}
              <span className="font-semibold">{details.name}</span> from the
              application's list and remove all of their data from the server.
              All of their images, links, and other data will be permanently
              lost.
            </DeleteWarning>
          </div>
        )}
      </div>
    </div>
  );
}
