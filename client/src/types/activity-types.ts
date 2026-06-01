export interface Activity {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  date: string;
  coverImageUrl: string;
  summary: string;
  gallery?: { _id: string; url: string; imgId: string }[];
  content: string;
  createdAt: string;
}

export type ActivitiesParams = {
  page: number;
  search: string;
  tag: string;
};

export type ActivityPreview = Omit<Activity, "gallery" | "content">;

export type Event = Pick<
  Activity,
  "_id" | "slug" | "title" | "tag" | "date" | "coverImageUrl" | "summary"
>;

export type Article = Pick<
  Activity,
  "_id" | "slug" | "title" | "tag" | "date" | "coverImageUrl" | "summary"
>;
