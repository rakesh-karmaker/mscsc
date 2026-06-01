import type { ActivitiesParams, ActivityPreview } from "./activity-types";
import type { User } from "./user-types";
import type { MemberPreview, MembersParams } from "./member-types";
import type { TaskPreview, TasksParams } from "./task-types";

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
  length: number;
  params: MembersParams;
  setParams: (newParams: Partial<MembersParams>) => void;
};

export type ActivitiesContextType = {
  activities: ActivityPreview[];
  isLoading: boolean;
  length: number;
  params: ActivitiesParams;
  setParams: (newParams: Partial<ActivitiesParams>) => void;
};

export type TasksContextType = {
  tasks: TaskPreview[] | null;
  length: number;
  isLoading: boolean;
  response: {
    results: TaskPreview[];
    selectedLength: number;
    totalLength: number;
  } | null;
  params: TasksParams;
  setParams: (newParams: Partial<TasksParams>) => void;
};
