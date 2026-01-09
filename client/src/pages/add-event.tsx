import EventForm from "@/components/forms/event-form/event-form";
import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

export default function AddEvent(): ReactNode {
  return (
    <>
      {/* page meta data */}
      <Helmet>
        <title>MSCSC - Add Event</title>
        <meta property="og:title" content="MSCSC - Add Event" />
        <meta name="twitter:title" content="MSCSC - Add Event" />
        <meta
          name="og:url"
          content="https://mscsc.netlify.app/admin/add-event"
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/admin/add-event`}
        />
      </Helmet>

      {/* page content */}
      <div>
        <AdminDashboardHeader title={"Add Event"}>
          Create a new event for the club
        </AdminDashboardHeader>

        <div className="pt-5! flex justify-center">
          <EventForm />
        </div>
      </div>
    </>
  );
}
