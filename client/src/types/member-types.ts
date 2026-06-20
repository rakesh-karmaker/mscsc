import type { ExtendedColumnSort } from "./table-types";
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
  | "createdAt"
> & { new: boolean };

export type AdminDashboardMemberPreview = Pick<
  User,
  "_id" | "name" | "slug" | "batch" | "branch" | "image" | "createdAt"
>;

export type MembersParams = {
  page: number;
  search: string;
  branch: string;
};

export type MemberEditTypes = {
  slug: string;
  isImageVerified?: boolean | undefined;
  isImageHidden?: boolean | undefined;
  position?: string | undefined;
  role?: string | undefined;
};

export type MemberTableData = Omit<
  User,
  "reason" | "timeline" | "submissions"
> & { new: boolean };

export type MembersSearchParams = {
  page: number;
  perPage: number;
  sort: ExtendedColumnSort<MemberTableData>[];
  name: string;
  batch: string;
  branch: string[];
  position: string[];
};
