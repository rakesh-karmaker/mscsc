import type { ExtendedColumnSort } from "../table-types";

export interface EventRegistrationDetails {
  _id: string;
  eventId: string;
  name: string;
  email: string;
  phoneNumber: string;
  facebookUrl: string;
  photoUrl: string;
  institution: string;
  grade: string;
  segments: string[];
  transactionMethod: "bkash" | "nagad" | "rocket" | "Other";
  transactionPhoneNumber: string;
  transactionId: string;
  registrationDate: string;
  status: "pending" | "validated" | "rejected";
  rejectionReason?: string;
  hasAttended: boolean;
  code: string;
  reference: string;
  clubReference?: string;
}

export type EventRegistrationTableData = Pick<
  EventRegistrationDetails,
  | "_id"
  | "name"
  | "email"
  | "photoUrl"
  | "phoneNumber"
  | "status"
  | "segments"
  | "grade"
  | "hasAttended"
  | "code"
  | "transactionMethod"
  | "registrationDate"
>;

export type EventRegistrationsSearchParams = {
  page: number;
  perPage: number;
  sort: ExtendedColumnSort<EventRegistrationTableData>[];
  regName: string;
  regStatus: string[];
  regCategory: string[];
  regSegments: string[];
  regCode: string;
  regTransactionMethod: string[];
};

export type CaPreviewData = {
  _id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  caCode: string;
  photoUrl: string;
};
