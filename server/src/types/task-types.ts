export type TaskSchemaType = {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  instructions: string;
  deadline: Date;
  first?: string;
  second?: string;
  third?: string;
  imageRequired: boolean;
  category: "article writing" | "poster design";
  submissions: {
    username: string;
    answer: string;
    poster: string | null;
    posterId: string | null;
    submissionDate: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type SubmissionType = {
  username: string;
  name: string;
  email: string;
  branch: string;
  batch: string;
  image: string;
  submissionDate: string;
  answer: string;
  poster?: string;
  posterId?: string;
};

export type SubmissionUpdateType = {
  [key: string]: string | undefined;
};
