import {
  changeClubPartnerStatus,
  createClubPartner,
  deleteClubPartner,
  editClubPartner,
} from "@/lib/api/event/club-partner";
import type { ClubPartnerFormData } from "@/lib/validation/club-partner-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function useClubPartnerMutation(
  setOpen?: Dispatch<SetStateAction<boolean>>,
) {
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
        queryKey: ["club-partners"],
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

      if (setOpen) setOpen(false);
    },
    onError: (e: AxiosError<{ message: string }>) => {
      console.error(e);
      toast.error(e?.response?.data?.message || "An error occurred");
    },
  });

  return clubPartnerMutation;
}
