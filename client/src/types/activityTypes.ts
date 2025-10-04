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

export type ActivityPreview = Omit<Activity, "gallery" | "content">;
