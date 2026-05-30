import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import QuickStat from "@/components/ui/quick-stat";
import { deleteEvent, getEventBySlug } from "@/lib/api/event/event";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { FaUsers } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { PiMedalMilitaryFill } from "react-icons/pi";
import { RiTeamFill } from "react-icons/ri";
import { useMembers } from "@/contexts/members-context";
import MemberList from "@/components/lists/member-list";
import CategoryDistributionChart from "@/components/charts/category-distribution";
// import MembersTable from "@/components/tables/members-table/members-table";
import { LuSettings, LuSquarePen, LuTrash2 } from "react-icons/lu";
import { useState } from "react";
import { Box, Popover, Tab, Tabs } from "@mui/material";
import RegistrationsTable from "@/components/tables/event/registrations-table/registrations-table";
import CaApplicationsTable from "@/components/tables/event/ca-table/ca-applications-table";
import { NavLink } from "react-router";
import DeleteWarning from "@/components/ui/delete-warning";
import { toast } from "react-hot-toast";
import ClubPartnersTable from "@/components/tables/event/club-partners-table/club-partners-table";

export default function EventDashboard() {
  const eventSlug = useParams().eventSlug || "";
  if (!eventSlug) {
    throw new Error("Event slug is required");
  }

  const [_, setSearchParams] = useSearchParams();
  const { members } = useMembers();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: eventData } = useQuery({
    queryKey: ["event", eventSlug],
    queryFn: () => getEventBySlug(eventSlug, true).then((res) => res.data),
  });

  const eventMutation = useMutation({
    mutationFn: () => deleteEvent(eventSlug),
    onError: () => {
      toast.error("Failed to delete the event");
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/admin/dashboard");
    },
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [tabValue, setTabValue] = useState<"registrations" | "caApplications">(
    "registrations",
  );

  function handleTabChange(
    _: React.SyntheticEvent,
    newValue: "registrations" | "caApplications",
  ) {
    setTabValue(newValue);
    setSearchParams({});
  }

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
          View all the details of{" "}
          <span className="capitalize">{eventData?.eventName}</span>
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
            <div className="w-full max-w-265 flex gap-6 flex-wrap p-6! shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-lg">
              {/* <MemberGrowthChart data={dashboardData} /> */}
              {/* <div className="w-full flex gap-5 max-[880px]:flex-col">
                <BatchDistributionChart data={dashboardData} />
                <BranchDistributionChart data={dashboardData} />
              </div> */}
              <Box
                sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Registrations" value={"registrations"} />
                  <Tab label="CA Applications" value={"caApplications"} />
                </Tabs>
              </Box>
              {tabValue === "registrations" ? (
                <RegistrationsTable segments={eventData?.segments || []} />
              ) : (
                <CaApplicationsTable />
              )}
            </div>
          </div>
          <div className="info-lists w-full min-w-25 max-w-129 flex flex-col gap-5">
            <div className="w-full flex justify-between items-center gap-10">
              <p>Settings: </p>
              <div className="flex gap-2">
                <NavLink
                  className="p-3! flex font-lg rounded-md bg-secondary-bg hover:opacity-70 transition-opacity cursor-pointer"
                  aria-describedby="Edit"
                  id="Edit-popover"
                  to={`/admin/edit-event/${eventSlug}`}
                >
                  <LuSquarePen />
                </NavLink>
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
                <div>
                  <button
                    className="p-3! font-lg rounded-md bg-red text-white hover:opacity-70 transition-opacity cursor-pointer"
                    aria-describedby="Delete"
                    onClick={() => setIsDeleteOpen((prev) => !prev)}
                    id="delete-popover"
                  >
                    <LuTrash2 />
                  </button>
                  <DeleteWarning
                    slug="delete-event"
                    title="Delete Event"
                    deleteFunc={() => eventMutation.mutate()}
                    open={isDeleteOpen}
                    setOpen={setIsDeleteOpen}
                  >
                    Are you sure you want to delete this event? This action
                    cannot be undone. All the data related to this event,
                    including registrations, teams, and CA applications, will be
                    permanently deleted.
                  </DeleteWarning>
                </div>
              </div>
            </div>
            {/* <MemberList members={members || []} /> */}
            <CategoryDistributionChart data={eventData} />

            <ClubPartnersTable />
            {/* <MessageList messages={messages || []} /> */}
          </div>
        </div>
      </div>
    </>
  );
}
