import FaTasks from "~icons/fa/tasks";
import FaUsers from "~icons/fa-solid/users";
import IoMailSharp from "~icons/ion/mail-sharp";
import FiActivity from "~icons/feather/activity";
import { getAdminData } from "@/lib/api/admin-dashboard";
import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import QuickStat from "../ui/quick-stat";
import type { AdminDashboardDataType } from "@/types/admin-dashboard-types";
import MemberGrowthChart from "@/components/charts/member-growth";
import BatchDistributionChart from "@/components/charts/batch-distribution";
import BranchDistributionChart from "@/components/charts/branch-distribution";
import MemberList from "../lists/member-list";
import MessageList from "../lists/message-list";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";

import "./admin-dashboard.css";

const AdminDashboard = () => {
  const { data, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["adminDashboardData"],
    queryFn: () => getAdminData().then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const dashboardData = data as AdminDashboardDataType;

  return (
    <>
      {/* page meta data */}
      <Helmet>
        <title>MSCSC - Admin Dashboard</title>
        <meta property="og:title" content={`MSCSC - Admin Dashboard`} />
        <meta name="twitter:title" content={`MSCSC - Admin Dashboard`} />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/admin/dashboard`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/admin/dashboard`}
        />
      </Helmet>

      {/* page content */}
      <div className="w-full h-full flex flex-col gap-6">
        <AdminDashboardHeader title={"Dashboard"}>
          Welcome to the admin dashboard
        </AdminDashboardHeader>
        <div className="w-full flex gap-5 max-[1360px]:flex-col">
          <div className="w-full flex flex-col gap-5">
            <div className="w-full grid grid-cols-4 max-[830px]:grid-cols-2 max-[500px]:grid-cols-1 gap-3 items-center">
              <QuickStat
                icon={<FaUsers className="text-2xl" />}
                title="Total Members"
                value={dashboardData?.quickStats?.totalMembers}
              />
              <QuickStat
                icon={<IoMailSharp className="text-2xl" />}
                title="Total Messages"
                value={dashboardData?.quickStats?.totalMessages}
              />
              <QuickStat
                icon={<FaTasks className="text-2xl" />}
                title="Total Tasks"
                value={dashboardData?.quickStats?.totalTasks}
              />
              <QuickStat
                icon={<FiActivity className="text-2xl" />}
                title="Total Activities"
                value={dashboardData?.quickStats?.totalActivities}
              />
            </div>
            <div className="w-full flex gap-6 flex-wrap">
              <MemberGrowthChart data={dashboardData} />
              <div className="w-full flex gap-5 max-[880px]:flex-col">
                <BatchDistributionChart data={dashboardData} />
                <BranchDistributionChart data={dashboardData} />
              </div>
            </div>
          </div>
          <div className="info-lists w-full min-w-25 max-w-129 flex flex-col gap-5">
            <MemberList
              members={dashboardData?.latestMembers || []}
              loading={isDashboardLoading}
            />
            <MessageList
              messages={dashboardData?.latestMessages || []}
              loading={isDashboardLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
