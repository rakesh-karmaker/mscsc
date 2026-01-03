import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import Task from "@/pages/task/task";
import { useState, type ReactNode } from "react";
import type { Task as TaskType } from "@/types/task-types";
import TaskForm from "@/components/forms/task-form/task-form";

import "./task-dashboard.css";

export default function TaskDashboard(): ReactNode {
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  return (
    <div className="admin-task">
      <AdminDashboardHeader title={"Task"}>
        View and manage all the task submissions of the club
      </AdminDashboardHeader>

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
}
