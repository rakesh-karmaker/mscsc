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
