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

export type SpType = {
  name: string;
  websiteUrl: string;
};

export type FaqType = {
  question: string;
  answer: string;
};
