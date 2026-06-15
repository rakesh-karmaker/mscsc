import { api } from "@/config/axios";

export async function getTeamById(eventSlug: string, teamId: string) {
  return api.get(`/teams/${eventSlug}/${teamId}`);
}

export async function editTeamStatus(
  eventSlug: string,
  teamId: string,
  data: {
    status: "pending" | "approved" | "rejected";
    rejectionReason?: string;
  },
) {
  return api.patch(`/teams/${eventSlug}/${teamId}/update-status`, data);
}

export async function deleteTeamById(eventSlug: string, teamId: string) {
  return api.delete(`/teams/${eventSlug}/${teamId}`);
}
