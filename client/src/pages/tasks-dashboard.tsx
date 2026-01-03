import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import Tasks from "./tasks";

export default function TasksDashboard() {
  return (
    <div className="admin-tasks">
      <AdminDashboardHeader title={"Tasks"}>
        View and manage all the tasks of the club
      </AdminDashboardHeader>

      <div className="admin-tasks-container">
        <Tasks admin={true} />
      </div>
    </div>
  );
}
