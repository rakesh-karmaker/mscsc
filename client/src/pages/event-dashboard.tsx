import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import QuickStat from "@/components/ui/quick-stat";
import { getEventBySlug } from "@/lib/api/event/event";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { FaUsers } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import { useParams, useSearchParams } from "react-router";
import { PiMedalMilitaryFill } from "react-icons/pi";
import { RiTeamFill } from "react-icons/ri";
import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import RegistrationsTable from "@/components/tables/event/registrations-table/registrations-table";
import CaApplicationsTable from "@/components/tables/event/ca-table/ca-applications-table";
import EventSettings from "@/components/events/event-settings";
import ClubPartnersTable from "@/components/tables/event/club-partners-table/club-partners-table";
import SegmentsDistributionChart from "@/components/charts/segments-distribution";

export default function EventDashboard() {
  const eventSlug = useParams().eventSlug || "";
  if (!eventSlug) {
    throw new Error("Event slug is required");
  }
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: eventData } = useQuery({
    queryKey: ["event", eventSlug],
    queryFn: () => getEventBySlug(eventSlug, true).then((res) => res.data),
  });

  const [tabValue, setTabValue] = useState<"registrations" | "caApplications">(
    searchParams.get("tab") === "caApplications"
      ? "caApplications"
      : "registrations",
  );

  function handleTabChange(
    _: React.SyntheticEvent,
    newValue: "registrations" | "caApplications",
  ) {
    setTabValue(newValue);
    setSearchParams({
      tab: newValue,
      ...(searchParams.get("clubName") && {
        clubName: searchParams.get("clubName")!,
      }),
    });
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
        <div className="w-full flex gap-5 max-xl:flex-col">
          {window.innerWidth < 1280 && (
            <EventSettings
              data={{
                hideRegistrationForm: eventData?.hideRegistrationForm || false,
                hideCAForm: eventData?.hideCAForm || false,
                isHidden: eventData?.isHidden || false,
              }}
            />
          )}
          <div className="w-full flex flex-col gap-5 max-[1800px]:max-w-[calc(100vw-(256px+32.25rem+(1.875rem*2)+1.25rem))] max-[1530px]:max-w-[calc(100vw-(32.25rem+(1.875rem*2)+1.25rem))] max-xl:max-w-full">
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
            <div className="w-full max-w-265 max-xl:max-w-full flex gap-6 flex-wrap p-6! shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-lg">
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
          <div className="info-lists w-full min-w-25 max-w-129 max-xl:max-w-full flex flex-col gap-5">
            {window.innerWidth >= 1280 && (
              <EventSettings
                data={{
                  hideRegistrationForm:
                    eventData?.hideRegistrationForm || false,
                  hideCAForm: eventData?.hideCAForm || false,
                  isHidden: eventData?.isHidden || false,
                }}
              />
            )}
            <SegmentsDistributionChart data={eventData} />
            <ClubPartnersTable />
          </div>
        </div>
      </div>
    </>
  );
}
