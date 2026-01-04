export type ActivitySchemaType = {
  tag: string;
  date: string;
  slug: string;
  coverImageUrl: string;
  coverImageId: string;
  title: string;
  summary: string;
  gallery: { url: string; imgId: string }[];
  content: string;
  createdAt: string;
  updatedAt: string;
};
