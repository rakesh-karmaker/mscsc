import { api } from "@/config/axios";
import type { ClubPartnerFormData } from "@/lib/validation/club-partner-schema";

export async function getClubAllPartners(
  params: {
    page?: number;
    perPage?: number;
    name?: string;
    status?: string[];
  },
  eventSlug: string,
) {
  return api.get(`/club-partners/${eventSlug}/partners`, {
    params,
  });
}

export async function getClubPartnerById(eventSlug: string, partnerId: string) {
  return api.get(`/club-partners/${eventSlug}/${partnerId}`);
}

export async function createClubPartner(
  eventSlug: string,
  data: ClubPartnerFormData,
) {
  const formData = new FormData();
  for (const key in data) {
    if (key === "clubLogo" && data.clubLogo) {
      formData.append("clubLogo", data.clubLogo[0]);
    } else {
      formData.append(key, data[key as keyof typeof data] as string);
    }
  }

  return api.post(`/club-partners/${eventSlug}/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function editClubPartner(
  eventSlug: string,
  partnerId: string,
  data: ClubPartnerFormData,
) {
  const formData = new FormData();
  for (const key in data) {
    if (key === "clubLogo" && data.clubLogo) {
      formData.append("clubLogo", data.clubLogo[0]);
    } else {
      formData.append(key, data[key as keyof typeof data] as string);
    }
  }

  return api.put(`/club-partners/${eventSlug}/${partnerId}/edit`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function changeClubPartnerStatus(
  eventSlug: string,
  partnerId: string,
  status: "active" | "inactive",
) {
  return api.patch(`/club-partners/${eventSlug}/${partnerId}/change-status`, {
    status,
  });
}

export async function deleteClubPartner(eventSlug: string, partnerId: string) {
  return api.delete(`/club-partners/${eventSlug}/${partnerId}/delete`);
}
