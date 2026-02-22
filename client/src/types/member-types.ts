import type { User } from "./user-types";

export type MemberPreview = Pick<
  User,
  | "_id"
  | "name"
  | "slug"
  | "batch"
  | "branch"
  | "image"
  | "role"
  | "position"
  | "isImageHidden"
  | "isImageVerified"
> & { new: boolean };

export type MemberEditTypes = {
  slug: string;
  isImageVerified?: boolean | undefined;
  isImageHidden?: boolean | undefined;
  position?: string | undefined;
  role?: string | undefined;
};

export type MemberTableData = Omit<
  User,
  "contactNumber" | "reason" | "timeline" | "submissions"
> & { new: boolean };
