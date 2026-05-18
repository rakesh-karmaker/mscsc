import {
  changeRegistrationStatus,
  deleteRegistration,
  editRegistration,
} from "@/lib/api/event/event-registrations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      registrationId,
      data,
    }: {
      method: "changeStatus" | "toggleAttendance" | "delete";
      registrationId: string;
      data?:
        | {
            status: "pending" | "validated" | "rejected";
            rejectionReason?: string;
          }
        | {
            hasAttended: boolean;
          }
        | {
            registrationId: string;
          };
    }) => {
      setCurrentMethod(method);
      if (method === "changeStatus" && data && "status" in data) {
        return changeRegistrationStatus(
          eventSlug,
          registrationId,
          data.status,
          data.rejectionReason,
        );
      } else if (
        method === "toggleAttendance" &&
        data &&
        "hasAttended" in data
      ) {
        return editRegistration(eventSlug, registrationId, {
          hasAttended: data.hasAttended,
        });
      } else if (method === "delete") {
        return deleteRegistration(eventSlug, registrationId);
      }
      return Promise.reject(new Error("Invalid method or data"));
    },
    onSuccess: () => {
      if (currentMethod == "delete") {
        queryClient.invalidateQueries({
          queryKey: ["event", eventSlug],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["event-registrations", eventSlug],
      });
      toast.success("Registration updated successfully");
      setCurrentMethod(null);
    },
  });

  return registrationMutation;
}
