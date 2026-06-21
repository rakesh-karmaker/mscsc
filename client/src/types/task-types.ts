export interface Task {
  _id: string;
  name: string;
  slug: string;
  category: "article writing" | "poster design";
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
  memberId: string;
  submissionDate: string; // ISO date string

  name?: string;
  slug?: string;
  image?: string;
  poster?: string;
  answer?: string;
  branch?: string;
  batch?: string;
  isImageHidden?: boolean;
  isImageVerified?: boolean;
};

export type TopSubmitter = {
  _id: string;
  name: string;
  slug: string;
  branch: string;
  batch: string;
  image: string;
  submissionCount: number;
  isImageHidden?: boolean;
  isImageVerified?: boolean;
};

export type TaskSubmitterType = {
  memberId: string;
  name: string;
  slug: string;
  branch: string;
  batch: string;
  image: string;
  isImageHidden?: boolean;
  isImageVerified?: boolean;
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

export type TasksParams = {
  page: number;
  search: string;
  category: "article writing" | "poster design" | "";
};
