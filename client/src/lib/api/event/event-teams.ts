import { api } from "@/config/axios";
import type { EventTeamsSearchParams } from "@/types/event/event-team-types";

export async function getTeams(
  eventSlug: string,
  params: EventTeamsSearchParams,
) {
  const filteredParams = {
    page: params.page,
    perPage: params.perPage,
    sort: params.sort,
    teamName: params.teamName,
    status: params.teamStatus,
    segments: params.teamSegments,
  };

  return api.get(`/teams/${eventSlug}`, { params: filteredParams });
}

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
