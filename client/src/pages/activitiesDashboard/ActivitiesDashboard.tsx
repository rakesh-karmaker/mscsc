import { useState } from "react";
import { useEffect } from "react";
import { getActivity } from "@/lib/api/activities";
import type { Activity, ActivityPreview } from "@/types/activityTypes";
import AdminDashboardHeader from "@/components/ui/AdminDashboardHeader";
import Activities from "../Activities";
import ActivityForm from "@/components/forms/activityForm/ActivityForm";

import "./activitiesDashboard.css";

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
