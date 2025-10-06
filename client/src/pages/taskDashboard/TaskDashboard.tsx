import AdminDashboardHeader from "@/components/ui/AdminDashboardHeader";
import Task from "@/pages/task/Task";
import { useState, type ReactNode } from "react";
import type { Task as TaskType } from "@/types/taskTypes";
import TaskForm from "@/components/forms/taskForm/TaskForm";

import "./taskDashboard.css";

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
