import type { ExtendedColumnSort } from "./table-types";

export type SegmentType = {
  segmentSlug: string;
  locationType: "onsite" | "online";
  teamType: "solo" | "team";
  icon: string;
  title: string;
  summary: string;
  details: string;
  rules: string;
};

export type ExperienceType = {
  experienceSlug: string;
  icon: string;
  title: string;
  details: string;
};

export type ScheduleItemType = {
  icon: string;
  fromTime: string;
  toTime: string;
  title: string;
  description: string;
};

export type RawScheduleItemType = ScheduleItemType & {
  date: string;
};

export type SpType = {
  name: string;
  websiteUrl: string;
};

export type FaqType = {
  question: string;
  answer: string;
};

export type BasicInfoType = {
  template: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  registrationUrl: string;
  isInnerRegistration: boolean;
  hasCAForm: boolean;
};

export type FormDataType = {
  registrationDeadline: string;
  title?: string;
  details?: string;
  fees?: string;
  transactionMethods?: {
    [method: string]: {
      number: string;
    };
  };
};

export type CAFromDataType = {
  title: string;
  details: string;
  applicationDeadline: string;
};

export type HeroDataType = {
  heading: string;
  text: string;
  icons: string[];
};

export type AboutDataType = {
  title: string;
  prizeCount: number;
  heading: string;
  text: string;
};

export type ScheduleDataType = { [date: string]: ScheduleItemType[] };

export type EventFormDataType = {
  basicInfo: BasicInfoType;
  sections: string[];
  hiddenSections: string[];
  contactLinks: { [platform: string]: string };
  formData: FormDataType;
  caFormData?: CAFromDataType;
  heroData?: HeroDataType;
  aboutData?: AboutDataType;
  segmentsData?: SegmentType[];
  experiencesData?: ExperienceType[];
  scheduleData?: ScheduleDataType;
  spData?: SpType[];
  faqData?: FaqType[];

  // for file uploads
  eventLogo: File;
  eventFavicon: File;
  eventBanner: File;
  bkashQrCode?: File;
  nagadQrCode?: File;
  rocketQrCode?: File;
  videoData?: File;
  aboutImage?: File;
  spLogos?: File[];
};

//* For Event Registrations Table

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
  name: string;
  status: string[];
  category: string[];
  segments: string[];
  code: string;
  transactionMethod: string[];
};

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
