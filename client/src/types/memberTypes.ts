import type { User } from "./userTypes";

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
