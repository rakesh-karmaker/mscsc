import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import Task from "@/pages/task/task";
import { useState, type ReactNode } from "react";
import type { Task as TaskType } from "@/types/task-types";
import TaskForm from "@/components/forms/task-form/task-form";
import { Helmet } from "react-helmet-async";

import "./task-dashboard.css";

export default function TaskDashboard(): ReactNode {
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  return (
    <>
      {/* page meta data */}
      <Helmet>
        <title>MSCSC - {selectedTask?.name || "Task Dashboard"}</title>
        <meta
          property="og:title"
          content={`MSCSC - ${selectedTask?.name || "Task Dashboard"}`}
        />
        <meta
          name="twitter:title"
          content={`MSCSC - ${selectedTask?.name || "Task Dashboard"}`}
        />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/admin/task/${selectedTask?.slug.toLowerCase()}`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/admin/task/${selectedTask?.slug.toLowerCase()}`}
        />
      </Helmet>

      {/* page content */}
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
    </>
  );
}
