import { deleteTeamById, editTeamStatus } from "@/lib/api/event/event-teams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function useTeamMutation(previousModels: {
  applications: string[];
  registrations: string[];
  teams: string[];
}) {
  const queryClient = useQueryClient();
  const eventSlug = useParams().eventSlug!;
  const [currentMethod, setCurrentMethod] = useState<
    "changeStatus" | "delete" | null
  >(null);

  const teamEditMutation = useMutation({
    mutationFn: ({
      method,
      documentId,
      data,
    }: {
      method: "changeStatus" | "delete";
      documentId: string;
      data?:
        | {
            status: "pending" | "approved" | "rejected";
            rejectionReason?: string;
          }
        | {
            documentId: string;
          };
    }) => {
      setCurrentMethod(method);
      if (method == "changeStatus" && data && "status" in data) {
        return editTeamStatus(eventSlug, documentId, data);
      } else if (method == "delete") {
        return deleteTeamById(eventSlug, documentId);
      }

      return Promise.reject(new Error("Invalid mutation method or data"));
    },
    onSuccess: (
      res: AxiosResponse<{
        message: string;
        _id?: string;
        emailSentError?: boolean;
      }>,
    ) => {
      if (currentMethod === "changeStatus") {
        toast.success("Edited Successfully!");
        queryClient.invalidateQueries({
          queryKey: [`team-${eventSlug}-${res.data._id}`],
        });
      } else if (currentMethod === "delete") {
        toast.success("Deleted Successfully!");
        queryClient.invalidateQueries({ queryKey: ["teams"] });
        queryClient.invalidateQueries({ queryKey: ["event"] });
      }

      previousModels.teams.forEach((id) => {
        queryClient.invalidateQueries({
          queryKey: [`team-${eventSlug}-${id}`],
        });
      });

      previousModels.registrations.forEach((id) => {
        queryClient.invalidateQueries({
          queryKey: [`registration-${eventSlug}-${id}`],
        });
      });

      previousModels.applications.forEach((id) => {
        queryClient.invalidateQueries({
          queryKey: [`application-${eventSlug}-${id}`],
        });
      });

      if (res.data.emailSentError) {
        toast.error(
          "Failed to send email to some team members. Check the logs for more details.",
        );
      }
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          `Failed to ${currentMethod === "changeStatus" ? "edit" : "delete"} team. Please try again.`,
      );
    },
  });

  return teamEditMutation;
}
