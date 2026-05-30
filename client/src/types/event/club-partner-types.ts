import type { ExtendedColumnSort } from "../table-types";
import type { EventRegistrationDetails } from "./event-registration-types";

export interface ClubPartnerData {
  _id: string;
  clubName: string;
  clubLogoUrl: string;

  clubEmail: string;
  phoneNumber: string;
  facebookUrl: string;

  institution: string;
  address: string;

  moderatorName: string;
  moderatorEmail: string;
  moderatorPhoneNumber: string;

  score: number;
  code: string;
  status: "active" | "inactive";

  createdAt: string;
}

export type ClubPartnerTableData = Pick<
  ClubPartnerData,
  | "_id"
  | "clubName"
  | "clubLogoUrl"
  | "code"
  | "score"
  | "status"
  | "facebookUrl"
>;

export type ClubPartnerRegistrations = Pick<
  EventRegistrationDetails,
  "_id" | "name" | "email" | "status" | "photoUrl"
>;

export type ClubPartnerSearchParams = {
  page: number;
  perPage: number;
  sort: ExtendedColumnSort<ClubPartnerTableData>[];
  clubName: string;
  clubStatus: string[];
};
