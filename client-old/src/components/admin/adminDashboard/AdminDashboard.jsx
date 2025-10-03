import { useMember } from "@/contexts/MembersContext";
import DashboardHeader from "@/components/admin/components/DashboardHeader/DashboardHeader";
import { useEffect, useState } from "react";
import { useMessages } from "@/components/admin/contexts/MessagesContext";
import "./AdminDashboard.css";
import { getAdminData } from "@/lib/api/adminData";
import { MemberGrowthChart } from "./MemberGrowthChart";
import { BranchDistributionChart } from "./BranchDistributionChart";
import { BatchDistributionChart } from "./BatchDistributionChart";
import { FaTasks, FaUsers } from "react-icons/fa";
import { QuickStat } from "./QuickStat";
import { IoMailSharp } from "react-icons/io5";
import { FiActivity } from "react-icons/fi";
import { MemberList } from "../components/Lists/MemberList";
import { MessageList } from "../components/Lists/MessageList";

const AdminDashboard = () => {
  const { members, setSearch, setPage, setRole } = useMember();
  const {
    messages,
    setSearch: messagesSearch,
    setPage: messagesPage,
  } = useMessages();
  const [dashboardData, setDashboardData] = useState(null);

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
      <DashboardHeader title={"Dashboard"}>
        Welcome to the admin dashboard
      </DashboardHeader>
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
          <MemberList members={members} />
          <MessageList messages={messages} />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
