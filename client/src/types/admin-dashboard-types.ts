import type { AdminDashboardMemberPreview } from "./member-types";
import type { MessageType } from "./message-types";

export type AdminDashboardDataType = {
  memberGrowth: { date: string; count: number }[];
  startDate: string;
  endDate: string;
  branchDistribution: { _id: string; count: number }[];
  batchDistribution: { batch: string; count: number }[];
  quickStats: {
    totalMembers: number;
    totalMessages: number;
    totalActivities: number;
    totalTasks: number;
  };
  latestMembers: AdminDashboardMemberPreview[];
  latestMessages: MessageType[];
};
