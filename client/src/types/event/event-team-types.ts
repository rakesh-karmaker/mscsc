import type { ExtendedColumnSort } from "../table-types";
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

  createdAt: string;
}

export type EventTeamPreviewData = Pick<
  EventTeamData,
  "_id" | "segmentSlug" | "teamName" | "leaderEmail" | "memberEmails" | "status"
>;

export type EventTeamTableData = Pick<
  EventTeamData,
  | "_id"
  | "segmentSlug"
  | "teamName"
  | "status"
  | "isPaidSegment"
  | "transactionMethod"
  | "createdAt"
>;

export type EventTeamsSearchParams = {
  page: number;
  perPage: number;
  sort: ExtendedColumnSort<EventTeamTableData>[];
  teamName: string;
  teamStatus: string[];
  teamSegments: string[];
};
