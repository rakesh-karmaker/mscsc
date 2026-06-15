import {
  changeClubPartnerStatus,
  createClubPartner,
  deleteClubPartner,
  editClubPartner,
} from "@/lib/api/event/club-partner";
import type { ClubPartnerFormData } from "@/lib/validation/club-partner-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function useClubPartnerMutation(
  setOpen?: Dispatch<SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();
  const eventSlug = useParams().eventSlug!;

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
    onSuccess: (res: AxiosResponse<{ message?: string }>) => {
      queryClient.invalidateQueries({
        queryKey: ["club-partners"],
      });
      toast.success(res.data.message || "Operation successful");
      if (setOpen) setOpen(false);
    },
    onError: (e: AxiosError<{ message?: string }>) => {
      console.error(e);
      toast.error(e?.response?.data?.message || "An error occurred");
    },
  });

  return clubPartnerMutation;
}
