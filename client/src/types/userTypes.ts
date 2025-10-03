export interface User {
  _id: string;
  name: string;
  slug: string;
  email: string;
  contactNumber: string;
  batch: string;
  branch:
    | "Main Boys"
    | "Main Girls"
    | "Branch - 1"
    | "Branch - 2"
    | "Branch - 3";
  image: string;
  reason: string; // AKA Description
  socialLink: string;
  role: "admin" | "member";
  position: string;
  timeline: TimelineType[];
  createdAt: string;
  submissions: { _id: string; taskId: string }[];
  isImageHidden: boolean;
  isImageVerified: boolean;
}

export type TimelineType = {
  _id: string;
  taskId: string | null;
  tag: string;
  date: string;
  title: string;
  description: string;
  link: string;
};
