import { api } from "@/config/axios";
import type { TeamEditSchema } from "@/lib/validation/team-edit-schema";

export async function getTeamById(eventSlug: string, teamId: string) {
  return api.get(`/teams/${eventSlug}/teams/${teamId}`);
}

export async function editTeam(
  eventSlug: string,
  teamId: string,
  data: TeamEditSchema,
) {
  data.memberEmails =
    data.memberEmails?.filter((email: string) => email.trim() !== "") || [];
  return api.patch(`/teams/${eventSlug}/teams/${teamId}`, data);
}

export async function deleteTeamById(eventSlug: string, teamId: string) {
  return api.delete(`/teams/${eventSlug}/teams/${teamId}`);
}
