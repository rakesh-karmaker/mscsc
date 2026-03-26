import mongoose from "mongoose";

export interface EventSchemaType extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  eventSlug: string;
  eventName: string;

  eventLogoUrl: string;
  eventLogoPublicId: string;

  eventFaviconUrl: string;
  eventFaviconPublicId: string;

  eventBannerUrl: string;
  eventBannerPublicId: string;

  registrationDeadline: string;
  caApplicationDeadline: string;

  hideRegistrationForm: boolean;
  hideCAForm: boolean;

  eventDescription: string;
  eventLocation: string;
  eventDate: string;
  participantCount: number;
  segmentCount: number;

  isUpcoming: boolean;
  isHidden: boolean;

  dataUrl: string;
  dataPublicId: string;

  createdAt: string;
  updatedAt: string;
}

export interface EventRegistrationSchemaType extends mongoose.Document {
  _id: mongoose.Types.ObjectId;

  eventId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  facebookUrl: string;
  photoUrl: string;
  photoPublicId: string;

  institution: string;
  grade: string;

  segments: string[];

  transactionMethod: string;
  transactionPhoneNumber: string;
  transactionId: string;

  reference: string;
  clubReference: string;

  registrationDate: string;
  status: "pending" | "validated" | "rejected";
  rejectionReason: string;
  code: string;
  hasAttended: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface EventCASchemaType extends mongoose.Document {
  _id: mongoose.Types.ObjectId;

  eventId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  facebookUrl: string;
  photoUrl: string;
  photoPublicId: string;
  address: string;
  gender: "male" | "female";

  institution: string;
  grade: string;

  description: string;

  hasPreviousExperience: boolean;
  previousExperienceDetails: string;

  applicationDate: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string;
  caCode: string;
  score: number;

  createdAt: string;
  updatedAt: string;
}

export interface EventTeamSchemaType extends mongoose.Document {
  _id: mongoose.Types.ObjectId;

  eventId: mongoose.Types.ObjectId;
  segmentSlug: string;

  teamName: string;
  leaderEmail: string;
  memberEmails: string[];
  status: "registering" | "pending" | "approved";

  createdAt: string;
  updatedAt: string;
}

// event data type

type BasicInfoType = {
  template: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  registrationUrl: string;
  isInnerRegistration: boolean;
  hasCAForm: boolean;

  eventLogoUrl: string;
  eventLogoPublicId: string;

  eventFaviconUrl: string;
  eventFaviconPublicId: string;
};

export type FormDataType = {
  registrationDeadline: string;
  title?: string;
  details?: string;
  fees?: string;
  transactionMethods?: {
    [method: string]: {
      number: string;
      qrCodeUrl?: string;
      qrCodePublicId?: string;
    };
  };
};

type CAFromDataType = {
  title: string;
  details: string;
  applicationDeadline: string;
};

type HeroDataType = {
  heading: string;
  text: string;
  icons: string[];
};

type VideoDataType = {
  hasAudio: boolean;
  url: string;
  videoPublicId: string;
};

export type AboutDataType = {
  title: string;
  prizeCount: number;
  heading: string;
  text: string;

  aboutImageUrl?: string;
  aboutImagePublicId?: string;
};

type SegmentType = {
  segmentSlug: string;
  locationType: "onsite" | "online";
  teamType: "solo" | "team";
  icon: string;
  title: string;
  summary: string;
  details: string;
  rules: string;
};

type ExperienceType = {
  experienceSlug: string;
  icon: string;
  title: string;
  details: string;
};

type ScheduleItemType = {
  icon: string;
  fromTime: string;
  toTime: string;
  title: string;
  description: string;
};

export type SpType = {
  name: string;
  websiteUrl: string;

  logoUrl: string;
  logoPublicId: string;
};

type FaqType = {
  question: string;
  answer: string;
};

type ScheduleDataType = { [date: string]: ScheduleItemType[] };

export type EventDataType = BasicInfoType & {
  sections: string[];
  hiddenSections: string[];
  contactLinks: { [platform: string]: string };
  formData: FormDataType;
  caFormData?: CAFromDataType;
  heroData?: HeroDataType;
  videoData?: VideoDataType;
  aboutData?: AboutDataType;
  segmentsData?: SegmentType[];
  experiencesData?: ExperienceType[];
  scheduleData?: ScheduleDataType;
  spData?: SpType[];
  faqData?: FaqType[];
};
