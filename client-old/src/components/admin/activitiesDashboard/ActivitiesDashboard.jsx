import Activities from "@/pages/activities/Activities";
import DashboardHeader from "@/components/admin/components/DashboardHeader/DashboardHeader";
import "./ActivitiesDashboard.css";
import ActivityForm from "@/components/admin/components/ActivityForm/ActivityForm";
import { useState } from "react";
import { useEffect } from "react";
import { getActivity } from "@/lib/api/activities";

const ActivitiesDashboard = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedActivityDetail, setSelectedActivityDetail] = useState(null);

  const fetchActivityDetail = async (slug) => {
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
        <DashboardHeader title={"Activities"}>
          View and manage all the activities of the club
        </DashboardHeader>
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
};

export default ActivitiesDashboard;
