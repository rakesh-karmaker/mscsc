import DashboardHeader from "@/components/admin/components/DashboardHeader/DashboardHeader";
import Task from "@/pages/task/Task";
import "./TaskDashboard.css";
import { useState } from "react";
import TaskForm from "@/components/admin/components/TaskForm/TaskForm";

const TaskDashboard = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  return (
    <div className="admin-task">
      <DashboardHeader title={"Task"}>
        View and manage all the task submissions of the club
      </DashboardHeader>

      {selectedTask ? (
        <TaskForm
          defaultValues={selectedTask}
          setSelectedTask={setSelectedTask}
          method={"edit"}
        />
      ) : (
        <div className="admin-task-container">
          <Task admin={true} setSelectedTask={setSelectedTask} />
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
