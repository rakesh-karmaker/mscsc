import Activities from "@/pages/activities/Activities";
import DashboardHeader from "@/components/admin/components/DashboardHeader/DashboardHeader";
import "./ActivitiesDashboard.css";
import ActivityForm from "@/components/admin/components/ActivityForm/ActivityForm";
import { useState } from "react";
import { useEffect } from "react";

const ActivitiesDashboard = () => {
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
        {selectedActivity != null ? (
          <ActivityForm
            defaultValues={selectedActivity}
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
