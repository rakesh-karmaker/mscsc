import type { ExtendedColumnSort } from "../table-types";
import type { EventRegistrationDetails } from "./event-registration-types";

export interface CaApplicationDetails {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  facebookUrl: string;
  photoUrl: string;
  address: string;
  gender: "male" | "female";
  institution: string;
  grade: string;
  description: string;
  hasPreviousExperience: boolean;
  previousExperienceDetails: string;
  applicationDate: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  caCode?: string;
  score: number;
}

export type RegistrationUsingCACode = Pick<
  EventRegistrationDetails,
  "_id" | "name" | "email" | "status" | "photoUrl"
>;

export type CaApplicationTableData = Pick<
  CaApplicationDetails,
  | "_id"
  | "name"
  | "email"
  | "phoneNumber"
  | "facebookUrl"
  | "photoUrl"
  | "applicationDate"
  | "hasPreviousExperience"
  | "status"
  | "caCode"
  | "score"
>;

export type CaApplicationsSearchParams = {
  page: number;
  perPage: number;
  sort: ExtendedColumnSort<CaApplicationTableData>[];
  name: string;
  status: string[];
  hasPreviousExperience: "yes" | "no" | "n/a";
  caCode: string;
};
