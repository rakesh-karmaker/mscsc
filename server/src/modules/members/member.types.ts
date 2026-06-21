import mongoose from "mongoose";
import { Role } from "../../shared/utils/roles.js";

export interface MemberSchemaType {
  name: string;
  slug: string;
  email: string;
  contactNumber: string;
  password: string;
  batch: number;
  branch:
    | "Main Boys"
    | "Main Girls"
    | "Branch - 1"
    | "Branch - 2"
    | "Branch - 3";
  image: string;
  imgId: string;
  reason: string;
  socialLink: string;
  timeline: {
    taskId: mongoose.Types.ObjectId | null;
    tag: string;
    date: string;
    title: string;
    description: string;
    link: string;
  }[];

  submissions: { taskId: mongoose.Types.ObjectId }[];
  reference: string;

  role: Role;
  position: string;

  new: boolean;
  isImageVerified: boolean;
  isImageHidden: boolean;

  createdAt: Date;
  updatedAt: Date;
}
