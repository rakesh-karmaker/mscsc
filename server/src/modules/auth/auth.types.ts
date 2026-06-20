export type NewMemberDataType = {
  name: string;
  email: string;
  contactNumber: string;
  batch: number;
  branch:
    | "Main Boys"
    | "Main Girls"
    | "Branch - 1"
    | "Branch - 2"
    | "Branch - 3";
  reason: string;
  socialLink: string;
  reference: string;
  password: string;
  image: string;
  imgId: string;
  slug: string;
  new: boolean;
};
