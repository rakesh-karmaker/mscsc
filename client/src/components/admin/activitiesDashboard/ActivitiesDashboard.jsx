import Activities from "@/pages/activities/Activities";
import DashboardHeader from "@/components/admin/components/DashboardHeader/DashboardHeader";
import "./ActivitiesDashboard.css";
import ActivityForm from "@/components/admin/components/ActivityForm/ActivityForm";
import { useState } from "react";
import { useEffect } from "react";

const ActivitiesDashboard = () => {
  const [createActivity, setCreateActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedActivity]);

  return (
    <>
      <div className="admin-activities">
        <DashboardHeader title={"Activities"}>
          View and manage all the activities of the club
        </DashboardHeader>
        <button
          className="primary-button activity-action"
          onClick={() => {
            selectedActivity === null && setCreateActivity((prev) => !prev);
            setSelectedActivity(null);
          }}
        >
          {createActivity || selectedActivity ? "Cancel" : "Create Activity"}
        </button>
        {createActivity || selectedActivity != null ? (
          <ActivityForm
            defaultValues={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            setCreateActivity={setCreateActivity}
          />
        ) : (
          <Activities admin={true} setSelectedActivity={setSelectedActivity} />
        )}
      </div>
    </>
  );
};

export default ActivitiesDashboard;
