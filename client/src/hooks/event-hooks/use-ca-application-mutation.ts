import {
  changeCaApplicationStatus,
  deleteCaApplication,
  editCaApplicationCaCode,
} from "@/lib/api/event/ca-applications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function useCaApplicationMutation() {
  const queryClient = useQueryClient();
  const eventSlug = useParams().eventSlug!;

  const [currentMethod, setCurrentMethod] = useState<
    "changeStatus" | "delete" | "editCaCode" | null
  >(null);

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
      setCurrentMethod(method);
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
    onError: (error: Error) => {
      toast.error(
        `Failed to ${currentMethod === "changeStatus" ? "change status" : currentMethod === "editCaCode" ? "update code" : "delete"} CA application: ${error.message}`,
      );
      console.error("Error in mutation:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["caApplications", eventSlug],
      });
      toast.success(
        `CA application ${currentMethod !== "delete" ? (currentMethod === "changeStatus" ? "status changed" : "code updated") : "deleted"} successfully`,
      );
      // if (currentMethod === "delete") {
      //   queryClient.invalidateQueries({
      //     queryKey: ["event", eventSlug],
      //   });
      // }
    },
  });

  return caApplicationMutation;
}
