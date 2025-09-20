export interface MemberSchemaType {
  name: string;
  slug: string;
  email: string;
  contactNumber: string;
  password: string;
  batch: string;
  branch: string;
  image: string;
  imgId: string;
  reason: string;
  socialLink: string;
  timeline: {
    taskId: string | null;
    tag: string;
    date: string;
    title: string;
    description: string;
    link: string;
  }[];
  submissions: { taskId: string }[];
  reference: string;
  role: string;
  position: string;
  new: boolean;
  isImageVerified: boolean;
  isImageHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NewMemberDataType = {
  name: string;
  email: string;
  contactNumber: string;
  batch: string;
  branch: string;
  reason: string;
  socialLink: string;
  reference: string;
  password: string;
  image: string;
  imgId: string;
  slug: string;
};
