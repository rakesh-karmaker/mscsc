import DashboardHeader from "@/components/admin/components/DashboardHeader/DashboardHeader";
import Tasks from "@/pages/tasks/Tasks";
import "./TasksDashboard.css";

const TasksDashBoard = () => {
  return (
    <div className="admin-tasks">
      <DashboardHeader title={"Tasks"}>
        View and manage all the tasks of the club
      </DashboardHeader>

      <div className="admin-tasks-container">
        <Tasks admin={true} />
      </div>
    </div>
  );
};

export default TasksDashBoard;
