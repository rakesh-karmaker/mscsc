import type { EventRegistrationDetails } from "./event-registration-types";

export interface EventTeamData {
  _id: string;
  segmentSlug: string;

  isPaidSegment: boolean;
  transactionMethod?: "bkash" | "rocket" | "nagad";
  transactionPhoneNumber?: string;
  transactionId?: string;

  teamName: string;
  leaderEmail: string;
  memberEmails: string[];

  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;

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
