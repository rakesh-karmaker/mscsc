import Activities from "@/pages/Activities";
import DashboardHeader from "@/admin/components/DashboardHeader/DashboardHeader";
import "./AdminActivities.css";
import ActivityForm from "@/admin/components/ActivityForm/ActivityForm";
// import ActivityForm from "@/admin/components/ActivityForm/ActivityForm";

const AdminActivities = () => {
  return (
    <div className="admin-activities">
      <DashboardHeader title={"Activities"}>
        View and manage all the activities of the club
      </DashboardHeader>
      <ActivityForm />
    </div>
  );
};

export default AdminActivities;
