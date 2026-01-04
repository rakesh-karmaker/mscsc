import { useState } from "react";
import { useEffect } from "react";
import { getActivity } from "@/lib/api/activities";
import type { Activity, ActivityPreview } from "@/types/activity-types";
import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import Activities from "../activities";
import ActivityForm from "@/components/forms/activity-form/activity-form";
import { Helmet } from "react-helmet-async";

import "./activities-dashboard.css";

export default function ActivitiesDashboard() {
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityPreview | null>(null);
  const [selectedActivityDetail, setSelectedActivityDetail] =
    useState<Activity | null>(null);

  const fetchActivityDetail = async (slug: string) => {
    try {
      const res = await getActivity(slug, true);
      if (res.data.activity) {
        setSelectedActivityDetail(res.data.activity);
      }
    } catch (error) {
      console.error("Error fetching activity detail:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (selectedActivity) {
      fetchActivityDetail(selectedActivity.slug);
    } else {
      setSelectedActivityDetail(null);
    }
  }, [selectedActivity]);

  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Activities Dashboard</title>
        <meta property="og:title" content={`MSCSC - Activities Dashboard`} />
        <meta name="twitter:title" content={`MSCSC - Activities Dashboard`} />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/admin/activities`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/admin/activities`}
        />
      </Helmet>

      {/* page content */}
      <div className="admin-activities">
        <AdminDashboardHeader title={"Activities"}>
          View and manage all the activities of the club
        </AdminDashboardHeader>
        {selectedActivityDetail != null ? (
          <ActivityForm
            defaultValues={selectedActivityDetail}
            setSelectedActivity={setSelectedActivity}
            method={"edit"}
          />
        ) : (
          <Activities admin={true} setSelectedActivity={setSelectedActivity} />
        )}
      </div>
    </>
  );
}
