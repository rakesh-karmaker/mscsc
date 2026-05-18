import type { EventRegistrationDetails } from "./event-registration-types";

export interface EventTeamData {
  _id: string;
  segmentSlug: string;
  teamName: string;
  leaderEmail: string;
  memberEmails: string[];
  status: "registering" | "pending" | "approved";
  memberRegistrations: Pick<
    EventRegistrationDetails,
    "_id" | "name" | "email" | "status" | "photoUrl"
  >[];
  leaderRegistration: Pick<
    EventRegistrationDetails,
    "_id" | "name" | "email" | "status" | "photoUrl"
  >;
}

export type EventTeamPreviewData = Pick<
  EventTeamData,
  "_id" | "segmentSlug" | "teamName" | "leaderEmail" | "memberEmails" | "status"
>;
