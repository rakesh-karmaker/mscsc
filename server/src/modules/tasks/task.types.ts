import mongoose from "mongoose";

export type Submission = {
  memberId: mongoose.Types.ObjectId;
  answer: string;
  poster: string | null;
  posterId: string | null;
  submissionDate: string;
};

export interface TaskSchemaType extends mongoose.Document {
  _id: mongoose.Types.ObjectId;

  name: string;
  slug: string;
  summary: string;
  instructions: string;
  deadline: Date;
  first: mongoose.Types.ObjectId | null;
  second: mongoose.Types.ObjectId | null;
  third: mongoose.Types.ObjectId | null;
  imageRequired: boolean;
  category: "article writing" | "poster design";

  submissions: Submission[];

  createdAt: string;
  updatedAt: string;
}

export type SubmissionUpdateType = {
  [key: string]: string | undefined;
};
