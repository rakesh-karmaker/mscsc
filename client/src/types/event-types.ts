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
  transactionMethods?: string;
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
  contactLinks: { [platform: string]: string }[];
  formData: FormDataType;
  caFormData?: CAFromDataType;
  heroData?: HeroDataType;
  videoData?: File;
  aboutData?: AboutDataType;
  segmentsData?: SegmentType[];
  experiencesData?: ExperienceType[];
  scheduleData?: ScheduleDataType;
  spData?: SpType[];
  faqData?: FaqType[];

  // for file uploads
  eventLogo: File;
  eventLogoFavicon: File;
  bkashQrCode?: File;
  nagadQrCode?: File;
  rocketQrCode?: File;
  aboutImage?: File;
  spLogos?: File[];
};
