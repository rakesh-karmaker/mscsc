import { deleteEvent, editEventMeta } from "@/lib/api/event/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import LuEye from "~icons/lucide/eye";
import LuEyeOff from "~icons/lucide/eye-off";
import LuSettings from "~icons/lucide/settings";
import LuSquarePen from "~icons/lucide/square-pen";
import LuTrash2 from "~icons/lucide/trash-2";
import { useState, type ReactNode } from "react";
import { Popover } from "@mui/material";
import { NavLink } from "react-router";
import DeleteWarning from "@/components/ui/delete-warning";
import { toast } from "react-hot-toast";
import { EVENT_WEBSITE_URL } from "@/config/constants";
import { TableBtn } from "@/components/ui/btns";
import type { AxiosError } from "axios";
import { useUser } from "@/contexts/user-context";
import { requireMinimumRole, ROLES } from "@/utils/require-minimum-role";

interface EventSettingsProps {
  data: {
    hideRegistrationForm: boolean;
    hideCAForm: boolean;
    isHidden: boolean;
  };
}

export default function EventSettings({ data }: EventSettingsProps): ReactNode {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const eventSlug = useParams().eventSlug || "";
  const { user } = useUser();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [method, setMethod] = useState<"edit" | "delete" | null>(null);

  const eventMutation = useMutation({
    mutationFn: ({
      method,
      slug,
      data,
    }: {
      method: "edit" | "delete";
      slug: string;
      data?: {
        hideRegistrationForm?: boolean;
        hideCAForm?: boolean;
        isHidden?: boolean;
      };
    }) => {
      setMethod(method);
      if (method === "delete") {
        return deleteEvent(slug);
      } else if (method === "edit" && data) {
        return editEventMeta(slug, data);
      }
      return Promise.reject(new Error("Invalid method"));
    },
    onError: (e: AxiosError) => {
      console.log(e);
      if (method === "edit") {
        toast.error("Failed to update event settings");
      } else if (method === "delete") {
        toast.error("Failed to delete the event");
      }
    },
    onSuccess: () => {
      if (method === "edit") {
        toast.success("Event settings updated successfully");
        queryClient.invalidateQueries({ queryKey: ["event"] });
      } else if (method === "delete") {
        toast.success("Event deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["events"] });
        navigate("/admin/dashboard");
      }
    },
    onSettled: () => {
      setMethod(null);
      setIsSettingsOpen(false);
    },
  });

  const settingsId = "event-settings-popover";

  function toggleSetting(key: string, value: boolean) {
    const newData = { [key]: value };
    eventMutation.mutate({
      method: "edit",
      slug: eventSlug,
      data: newData,
    });
  }

  return (
    <div className="w-full flex justify-between items-center gap-10 max-xs:flex-col max-xs:gap-4 max-xs:items-start">
      <p>Settings: </p>
      <div className="flex gap-2">
        <a
          className="p-3! flex font-lg rounded-md bg-secondary-bg hover:opacity-70 transition-opacity cursor-pointer"
          aria-describedby="Event-Page"
          href={`${EVENT_WEBSITE_URL}/${eventSlug}`}
        >
          <LuEye />
        </a>
        {requireMinimumRole(user?.role || ROLES.MEMBER, ROLES.EDITOR) && (
          <>
            <NavLink
              className="p-3! flex font-lg rounded-md bg-secondary-bg hover:opacity-70 transition-opacity cursor-pointer"
              aria-describedby="Edit"
              to={`/admin/edit-event/${eventSlug}`}
            >
              <LuSquarePen />
            </NavLink>

            <div className="w-fit flex items-center justify-center">
              <button
                id={settingsId}
                className={
                  "p-3! flex font-lg rounded-md bg-secondary-bg hover:opacity-70 transition-opacity cursor-pointer"
                }
                aria-describedby={settingsId}
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                <LuSettings />
              </button>
              <Popover
                id={settingsId}
                open={isSettingsOpen}
                anchorEl={document.getElementById(settingsId)}
                onClose={() => setIsSettingsOpen(false)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  style: {
                    boxShadow: "rgba(149, 157, 165, 0.1) 0px 8px 24px",
                    marginTop: "4px",
                  },
                }}
              >
                <div className="w-full h-full flex flex-col bg-primary-bg rounded-md border border-gray-300">
                  <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
                    <TableBtn
                      onClick={() => {
                        toggleSetting(
                          "hideRegistrationForm",
                          !data.hideRegistrationForm,
                        );
                      }}
                    >
                      {data.hideRegistrationForm ? (
                        <LuEye className="opacity-70" />
                      ) : (
                        <LuEyeOff className="opacity-70" />
                      )}
                      <p>
                        {data.hideRegistrationForm ? "Show" : "Hide"}{" "}
                        Registration Form
                      </p>
                    </TableBtn>
                    <TableBtn
                      onClick={() => {
                        toggleSetting("hideCAForm", !data.hideCAForm);
                      }}
                    >
                      {data.hideCAForm ? (
                        <LuEye className="opacity-70" />
                      ) : (
                        <LuEyeOff className="opacity-70" />
                      )}
                      <p>{data.hideCAForm ? "Show" : "Hide"} CA Form</p>
                    </TableBtn>
                    <TableBtn
                      onClick={() => {
                        toggleSetting("isHidden", !data.isHidden);
                      }}
                    >
                      {data.isHidden ? (
                        <LuEye className="opacity-70" />
                      ) : (
                        <LuEyeOff className="opacity-70" />
                      )}
                      <p>{data.isHidden ? "Show" : "Hide"} Event</p>
                    </TableBtn>
                  </div>
                </div>
              </Popover>
            </div>
          </>
        )}

        {requireMinimumRole(user?.role || ROLES.MEMBER, ROLES.ADMIN) && (
          <div>
            <button
              className="p-3! font-lg rounded-md bg-red text-white hover:opacity-70 transition-opacity cursor-pointer"
              aria-describedby="Delete"
              onClick={() => setIsDeleteOpen((prev) => !prev)}
              id="delete-popover"
            >
              <LuTrash2 />
            </button>
            <DeleteWarning
              slug="delete-event"
              title="Delete Event"
              deleteFunc={() =>
                eventMutation.mutate({
                  method: "delete",
                  slug: eventSlug,
                })
              }
              open={isDeleteOpen}
              setOpen={setIsDeleteOpen}
            >
              Are you sure you want to delete this event? This action cannot be
              undone. All the data related to this event, including
              registrations, teams, and CA applications, will be permanently
              deleted.
            </DeleteWarning>
          </div>
        )}
      </div>
    </div>
  );
}
