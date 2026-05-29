import {
  changeClubPartnerStatus,
  createClubPartner,
  deleteClubPartner,
  editClubPartner,
} from "@/lib/api/event/club-partner";
import type { ClubPartnerFormData } from "@/lib/validation/club-partner-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast/headless";
import { useParams } from "react-router-dom";

export default function useClubPartnerMutation() {
  const queryClient = useQueryClient();
  const eventSlug = useParams().eventSlug!;

  const [currentMethod, setCurrentMethod] = useState<
    "create" | "delete" | "changeStatus" | "edit" | null
  >(null);

  const clubPartnerMutation = useMutation({
    mutationFn: ({
      method,
      clubPartnerId,
      data,
    }: {
      method: "create" | "edit" | "delete" | "changeStatus";
      clubPartnerId?: string;
      data?:
        | {
            formData: ClubPartnerFormData;
          }
        | {
            clubPartnerId: string;
            status: "active" | "inactive";
          };
    }) => {
      setCurrentMethod(method);
      if (method === "create" && data && "formData" in data) {
        return createClubPartner(eventSlug, data.formData);
      } else if (
        method === "edit" &&
        data &&
        "formData" in data &&
        clubPartnerId
      ) {
        return editClubPartner(eventSlug, clubPartnerId, data.formData);
      } else if (method === "delete" && clubPartnerId) {
        return deleteClubPartner(eventSlug, clubPartnerId);
      } else if (
        method === "changeStatus" &&
        data &&
        "status" in data &&
        clubPartnerId
      ) {
        return changeClubPartnerStatus(eventSlug, clubPartnerId, data.status);
      }
      return Promise.reject(new Error("Invalid method or data"));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clubPartners"],
      });
      if (currentMethod == "delete") {
        toast.success("Club partner deleted successfully");
      } else if (currentMethod == "create") {
        toast.success("Club partner created successfully");
      } else if (currentMethod == "edit") {
        toast.success("Club partner updated successfully");
      } else if (currentMethod == "changeStatus") {
        toast.success("Club partner status updated successfully");
      }
    },
    onError: (e: Error) => {
      console.error(e);
      if (currentMethod == "delete") {
        toast.error("Failed to delete club partner");
      } else if (currentMethod == "create") {
        toast.error("Failed to create club partner");
      } else if (currentMethod == "edit") {
        toast.error("Failed to update club partner");
      } else if (currentMethod == "changeStatus") {
        toast.error("Failed to change club partner status");
      }
    },
  });

  return clubPartnerMutation;
}
