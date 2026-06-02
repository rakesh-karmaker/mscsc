import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEventBySlug, getJSONData } from "@/lib/api/event/event";
import Loader from "@/components/ui/loader/loader";
import { Helmet } from "react-helmet-async";
import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import EventForm from "@/components/forms/event-form/event-form";
import type { AxiosError } from "axios";
import filterEventJSONData from "@/utils/filter-event-json-data";

export default function EditEvent() {
  const eventSlug = useParams().eventSlug;
  if (!eventSlug) {
    throw new Error("Event slug is required");
  }

  const [error, setError] = useState<string | null>(null);

  // Fetch event data based on eventId
  const {
    data: eventData,
    isLoading: eventDataLoading,
    error: eventDataError,
  } = useQuery({
    queryKey: ["eventData", eventSlug],
    queryFn: () =>
      getEventBySlug(eventSlug as string, false)
        .then((res) =>
          res.status === 200 && res.data
            ? getJSONData(res.data.dataUrl, {
                hideRegistrationForm: res.data.hideRegistrationForm,
                hideCAForm: res.data.hideCAForm,
                participantCount: res.data.participantCount,
              })
            : console.log("hello"),
        )
        .catch((error: AxiosError | any) => {
          setError(
            `Error: ${error.response?.status} - ${error.response?.data?.message || "An error occurred while fetching event data"}`,
          );
          return null;
        }),
  });

  if (eventDataLoading) {
    return <Loader />;
  }

  if (error || eventDataError) {
    console.error("Error fetching event data:", error || eventDataError);
    throw new Error(
      error || eventDataError instanceof Error
        ? eventDataError?.message
        : "An error occurred while fetching event data",
    );
  }

  const defaultValues = filterEventJSONData(eventData);

  return (
    <>
      {/* page meta data */}
      <Helmet>
        <title>MSCSC - Edit Event</title>
        <meta property="og:title" content="MSCSC - Edit Event" />
        <meta name="twitter:title" content="MSCSC - Edit Event" />
        <meta
          name="og:url"
          content="https://mscsc.netlify.app/admin/edit-event/:eventSlug"
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/admin/edit-event/:eventSlug`}
        />
      </Helmet>

      {/* page content */}
      <div>
        <AdminDashboardHeader title={"Edit Event"}>
          Update the event details
        </AdminDashboardHeader>

        <div className="pt-5! flex justify-center">
          <EventForm defaultValues={defaultValues} />
        </div>
      </div>
    </>
  );
}
