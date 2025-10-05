export interface Task {
  _id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  instructions: string;
  deadline: string; // ISO date string
  first: string | null;
  second: string | null;
  third: string | null;
  imageRequired: boolean;
  createdAt: string; // ISO date string
  submissions: Submission[];
}

export type Submission = {
  username: string;
  name: string;
  image: string;
  poster?: string;
  answer?: string;
  branch: string;
  batch: string;
  isImageHidden: boolean;
  submissionDate: string; // ISO date string
};

export type TopSubmitter = {
  _id: string;
  name: string;
  slug: string;
  branch: string;
  batch: string;
  image: string;
  submissionCount: number;
  isImageHidden: boolean;
};

export type TaskSubmitterType = {
  username: string;
  name: string;
  branch: string;
  batch: string;
  image: string;
  isImageHidden: boolean;
  submissionDate: string; // ISO date string
};

export type TaskPreview = Pick<
  Task,
  | "_id"
  | "name"
  | "slug"
  | "category"
  | "summary"
  | "deadline"
  | "first"
  | "second"
  | "third"
> & { submissionCount: number };
