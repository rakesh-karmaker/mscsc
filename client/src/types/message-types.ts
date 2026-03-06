import type { ExtendedColumnSort } from "./table-types";

export type MessageType = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  new: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type MessageTableData = Omit<MessageType, "__v" | "updatedAt">;

export type MessagesSearchParams = {
  page: number;
  perPage: number;
  sort: ExtendedColumnSort<MessageTableData>[];
  name: string;
  email: string;
  source: string;
};
