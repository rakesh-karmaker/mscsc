import {
  changeCaApplicationStatus,
  deleteCaApplication,
  editCaApplicationCaCode,
} from "@/lib/api/event/ca-applications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function useCaApplicationMutation() {
  const queryClient = useQueryClient();
  const eventSlug = useParams().eventSlug!;

  const caApplicationMutation = useMutation({
    mutationFn: ({
      method,
      documentId,
      data,
    }: {
      method: "changeStatus" | "delete" | "editCaCode";
      documentId: string;
      data?:
        | {
            status: "pending" | "approved" | "rejected";
            rejectionReason?: string;
            caCode?: string;
          }
        | {
            documentId: string;
          }
        | {
            caCode: string;
          };
    }) => {
      if (method === "changeStatus" && data && "status" in data) {
        return changeCaApplicationStatus(
          eventSlug,
          documentId,
          data.status,
          data.caCode,
          data.rejectionReason,
        );
      } else if (method === "editCaCode" && data && "caCode" in data) {
        return editCaApplicationCaCode(
          eventSlug,
          documentId,
          data.caCode as string,
        );
      } else if (method === "delete") {
        return deleteCaApplication(eventSlug, documentId);
      }
      return Promise.reject(new Error("Invalid method or data"));
    },
    onSuccess: (
      res: AxiosResponse<{ message?: string; emailSentError?: boolean }>,
    ) => {
      queryClient.invalidateQueries({
        queryKey: ["caApplications", eventSlug],
      });
      toast.success(res.data?.message || "CA application updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["event", eventSlug],
      });

      if (res.data.emailSentError) {
        toast.error("Error sending email. Check log");
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error("Error in mutation:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating CA application",
      );
    },
  });

  return caApplicationMutation;
}
