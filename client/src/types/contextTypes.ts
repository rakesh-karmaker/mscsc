import type { ActivityPreview } from "./activityTypes";
import type { User } from "./userTypes";
import type { MemberPreview } from "./memberTypes";
import type { TaskPreview } from "./taskTypes";
import type { Dispatch, SetStateAction } from "react";
import type { MessageType } from "./messageTypes";

export type UserContextType = {
  user: User | null;
  isVerifying: boolean;
};

export type MembersContextType = {
  response: {
    results: MemberPreview[];
    selectedLength: number;
    adminLength: number;
    totalLength: number;
  } | null;
  members: MemberPreview[] | null;
  isLoading: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  role: string;
  setRole: Dispatch<SetStateAction<string>>;
  branch: string;
  setBranch: Dispatch<SetStateAction<string>>;
  length: number;
  position: string;
  setPosition: Dispatch<SetStateAction<string>>;
};

export type ActivitiesContextType = {
  activities: ActivityPreview[];
  length: number;
  tag: string;
  setTag: Dispatch<SetStateAction<string>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
};

export type TasksContextType = {
  tasks: TaskPreview[] | null;
  length: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  response: {
    results: TaskPreview[];
    selectedLength: number;
    totalLength: number;
  } | null;
  refetch: () => void;
};

export type MessagesContextType = {
  messages: MessageType[] | null;
  isLoading: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  length: number;
  response: {
    results: MessageType[];
    selectedLength: number;
    totalLength: number;
  } | null;
};
