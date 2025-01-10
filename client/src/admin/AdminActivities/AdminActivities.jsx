import Activities from "@/pages/Activities";
import DashboardHeader from "@/admin/components/DashboardHeader/DashboardHeader";
import "./AdminActivities.css";
import ActivityForm from "@/admin/components/ActivityForm/ActivityForm";
import { useState } from "react";
import { deleteActivity } from "@/services/DeleteService";
import { useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import MetaTags from "@/layout/MetaTags";

const AdminActivities = () => {
  const queryClient = useQueryClient();
  const [createActivity, setCreateActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleDeleteActivity = async (_id) => {
    const res = await deleteActivity(_id);
    if (res.status === 200) {
      queryClient.invalidateQueries("activities");
      toast.success("Activity deleted successfully");
      setSelectedActivity(null);
    }
    console.log(res);
  };

  return (
    <>
      <MetaTags
        title="Admin - Activities"
        description="MSCSC is the ideal place for Math, Science, Biology, IT, and Astronomy enthusiasts, offering top-notch learning, hands-on experiences, and expert guidance."
      />
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
            deleteActivity={handleDeleteActivity}
          />
        ) : (
          <Activities admin={true} setSelectedActivity={setSelectedActivity} />
        )}
        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default AdminActivities;
