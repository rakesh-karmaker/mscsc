import { api } from "@/config/axios";
import type { CaApplicationsSearchParams } from "@/types/event/ca-types";

export async function getCaApplications(
  eventSlug: string,
  params: CaApplicationsSearchParams,
) {
  return api.get(`/ca-applications/${eventSlug}`, { params });
}

export async function getCaApplicationById(
  eventSlug: string,
  applicationId: string,
) {
  return api.get(`/ca-applications/${eventSlug}/${applicationId}`);
}

export async function changeCaApplicationStatus(
  eventSlug: string,
  applicationId: string,
  status: "approved" | "rejected" | "pending",
  caCode?: string,
  rejectionReason?: string,
) {
  return api.patch(`/ca-applications/${eventSlug}/${applicationId}/status`, {
    status,
    caCode,
    rejectionReason,
  });
}

export async function editCaApplicationCaCode(
  eventSlug: string,
  applicationId: string,
  caCode: string,
) {
  return api.patch(`/ca-applications/${eventSlug}/${applicationId}/edit`, {
    caCode,
  });
}

export async function deleteCaApplication(
  eventSlug: string,
  applicationId: string,
) {
  return api.delete(`/ca-applications/${eventSlug}/${applicationId}`);
}
