import mongoose from "mongoose";

export type EventSchemaType = {
  _id: mongoose.Types.ObjectId;
  eventSlug: string;
  eventName: string;

  eventLogoUrl: string;
  eventLogoPublicId: string;

  eventFaviconUrl: string;
  eventFaviconPublicId: string;

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
};

export type EventRegistrationSchemaType = {
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

  registrationDate: string;
  isVerified: boolean;
  hasAttended: boolean;

  createdAt: string;
  updatedAt: string;
};

export type EventCASchemaType = {
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

  havePreviousExperience: boolean;

  description: string;

  isValidated: boolean;
  caCode: string;

  createdAt: string;
  updatedAt: string;
};

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
