import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import QuickStat from "@/components/ui/quick-stat";
import { getEventBySlug } from "@/lib/api/event/event";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { FaUsers } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import { useParams } from "react-router-dom";
import { PiMedalMilitaryFill } from "react-icons/pi";
import { RiTeamFill } from "react-icons/ri";
import { useMembers } from "@/contexts/members-context";
import MemberList from "@/components/lists/member-list";
import CategoryDistributionChart from "@/components/charts/category-distribution";
import MembersTable from "@/components/tables/members-table/members-table";
import { LuSettings } from "react-icons/lu";
import { useState } from "react";
import { Popover } from "@mui/material";
import RegistrationsTable from "@/components/tables/event/registrations-table/registrations-table";

export default function EventDashboard() {
  const eventSlug = useParams().eventSlug || "";
  if (!eventSlug) {
    throw new Error("Event slug is required");
  }

  const { members } = useMembers();

  const {
    data: eventData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", eventSlug],
    queryFn: () => getEventBySlug(eventSlug).then((res) => res.data),
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Events Dashboard</title>
        <meta property="og:title" content={`MSCSC - Events Dashboard`} />
        <meta name="twitter:title" content={`MSCSC - Events Dashboard`} />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/admin/events`}
        />
        <link rel="canonical" href={`https://mscsc.netlify.app/admin/events`} />
      </Helmet>

      {/* page content */}
      <div className="w-full h-full min-h-[calc(100svh-60px)] flex flex-col gap-6">
        <AdminDashboardHeader title={"Event"}>
          View all the details of the event{" "}
          <span className="capitalize">{eventSlug}</span>
        </AdminDashboardHeader>
        <div className="w-full flex gap-5 max-[1360px]:flex-col">
          <div className="w-full flex flex-col gap-5">
            <div className="w-full grid grid-cols-4 max-[830px]:grid-cols-2 max-[500px]:grid-cols-1 gap-3 items-center">
              <QuickStat
                icon={<FaUsers className="text-2xl" />}
                title="Total Registrations"
                value={eventData?.registrations || 0}
              />
              <QuickStat
                icon={<TbCurrencyTaka className="text-2xl" />}
                title="Total Income"
                value={eventData?.income || 0}
              />
              <QuickStat
                icon={<PiMedalMilitaryFill className="text-2xl" />}
                title="Total CAs"
                value={eventData?.eventCAs || 0}
              />
              <QuickStat
                icon={<RiTeamFill className="text-2xl" />}
                title="Total Teams"
                value={eventData?.teams || 0}
              />
            </div>
            <div className="w-full flex gap-6 flex-wrap">
              {/* <MemberGrowthChart data={dashboardData} /> */}
              <div className="w-full flex gap-5 max-[880px]:flex-col">
                {/* <BatchDistributionChart data={dashboardData} />
                <BranchDistributionChart data={dashboardData} /> */}
                {/* <CategoryDistributionChart data={eventData} /> */}
              </div>
              <RegistrationsTable segments={eventData?.segments || []} />
            </div>
          </div>
          <div className="info-lists w-full min-w-25 max-w-129 flex flex-col gap-5">
            <div className="w-full flex justify-between items-center gap-10">
              <p>Settings: </p>
              <div>
                <button
                  className="p-3! font-lg rounded-md bg-secondary-bg hover:opacity-70 transition-opacity cursor-pointer"
                  aria-describedby="Settings"
                  onClick={() => setIsSettingsOpen((prev) => !prev)}
                  id="settings-popover"
                >
                  <LuSettings />
                </button>
                <Popover
                  id="Settings"
                  anchorEl={() => {
                    return document.getElementById("settings-popover");
                  }}
                  open={isSettingsOpen}
                  onClose={() => setIsSettingsOpen(false)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    style: {
                      boxShadow: "rgba(149, 157, 165, 0.1) 0px 8px 24px",
                      marginTop: "4px",
                    },
                  }}
                >
                  <div className="w-full h-full flex flex-col bg-primary-bg rounded-md border border-gray-300 p-2!">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setIsSettingsOpen(false);
                        // Handle edit event logic here
                      }}
                    >
                      Edit Event
                    </button>
                  </div>
                </Popover>
              </div>
            </div>
            <MemberList members={members || []} />
            {/* <MessageList messages={messages || []} /> */}
          </div>
        </div>
      </div>
    </>
  );
}
