import {
  changeRegistrationStatus,
  deleteRegistration,
  editRegistration,
} from "@/lib/api/event/event-registrations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function useRegistrationMutation() {
  const queryClient = useQueryClient();
  const eventSlug = useParams().eventSlug!;

  const [currentMethod, setCurrentMethod] = useState<
    "changeStatus" | "toggleAttendance" | "delete" | null
  >(null);

  const registrationMutation = useMutation({
    mutationFn: ({
      method,
      documentId,
      data,
    }: {
      method: "changeStatus" | "toggleAttendance" | "delete";
      documentId: string;
      data?:
        | {
            status: "pending" | "validated" | "rejected";
            rejectionReason?: string;
          }
        | {
            hasAttended: boolean;
          }
        | {
            documentId: string;
          };
    }) => {
      setCurrentMethod(method);
      if (method === "changeStatus" && data && "status" in data) {
        return changeRegistrationStatus(
          eventSlug,
          documentId,
          data.status,
          data.rejectionReason,
        );
      } else if (
        method === "toggleAttendance" &&
        data &&
        "hasAttended" in data
      ) {
        return editRegistration(eventSlug, documentId, {
          hasAttended: data.hasAttended,
        });
      } else if (method === "delete") {
        return deleteRegistration(eventSlug, documentId);
      }
      return Promise.reject(new Error("Invalid method or data"));
    },
    onSuccess: (
      res: AxiosResponse<{ message: string; emailSentError?: boolean }>,
    ) => {
      if (currentMethod == "delete") {
        queryClient.invalidateQueries({
          queryKey: ["event", eventSlug],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["event-registrations", eventSlug],
      });
      if (res.data.emailSentError) {
        toast.error(
          "Registration updated but failed to send email. Check the logs",
        );
      }
      toast.success(res.data.message || "Operation successful");
      if (res.data?.emailSentError) {
        toast.error("Error sending email. Check log");
      }

      setCurrentMethod(null);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  return registrationMutation;
}
