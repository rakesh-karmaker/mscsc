import { useEffect, useState } from "react";
import { FaTasks, FaUsers } from "react-icons/fa";
import { IoMailSharp } from "react-icons/io5";
import { FiActivity } from "react-icons/fi";
import { useMembers } from "@/contexts/members-context";
import { useMessages } from "@/contexts/messages-context";
import { getAdminData } from "@/lib/api/admin-dashboard";
import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import QuickStat from "./quick-stat";
import type { AdminDashboardDataType } from "@/types/admin-dashboard-types";
import MemberGrowthChart from "@/components/charts/member-growth";
import BatchDistributionChart from "@/components/charts/batch-distribution";
import BranchDistributionChart from "@/components/charts/branch-distribution";
import MemberList from "../lists/member-list";
import MessageList from "../lists/message-list";

import "./admin-dashboard.css";
import { Helmet } from "react-helmet-async";

const AdminDashboard = () => {
  const { members, setSearch, setPage, setRole } = useMembers();
  const {
    messages,
    setSearch: messagesSearch,
    setPage: messagesPage,
  } = useMessages();
  const [dashboardData, setDashboardData] =
    useState<AdminDashboardDataType | null>(null);

  useEffect(() => {
    setRole("");
    setSearch("");
    setPage(1);
    messagesSearch("");
    messagesPage(1);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await getAdminData();
      setDashboardData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      <AdminDashboardHeader title={"Dashboard"}>
        Welcome to the admin dashboard
      </AdminDashboardHeader>
      <div className="dashboard-container w-full flex gap-5">
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
          <MemberList members={members || []} />
          <MessageList messages={messages || []} />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
