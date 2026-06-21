import { NavLink } from "react-router-dom";
import type { TaskPreview } from "@/types/task-types";
import type { ReactNode } from "react";
import Empty from "@/components/ui/empty/empty";
import PaginationContainer from "@/components/ui/pagination-container/pagination-container";
import TaskTags from "@/components/ui/task-tags/task-tags";
import { useUser } from "@/contexts/user-context";

import "./task-list.css";

type TaskListProps = {
  tasks: TaskPreview[];
  length: number;
  page: number;
  submissions?: string[];
  isDashboard?: boolean;
  setPage: (newPage: number) => void;
};

export default function TaskList({
  tasks,
  length,
  page,
  setPage,
  submissions,
  isDashboard,
}: TaskListProps): ReactNode {
  // check if there are tasks to display
  if (tasks?.length === 0) return <Empty />;
  const { user } = useUser();

  return (
    <div className="task-container">
      <ul className="tasks">
        {tasks?.map((task) => {
          return (
            <li key={task._id}>
              <NavLink
                to={`${isDashboard ? "/admin" : ""}/task/${task.slug}${
                  !isDashboard && user?.slug ? `?user=${user.slug}` : ""
                }`}
                className="task"
              >
                <p className="task-name" title={task.name}>
                  {task.name?.slice(0, 36)}
                  {task.name?.length > 36 ? "..." : ""}
                </p>
                <p className="task-summary">
                  {task.summary.slice(0, 75)}
                  {task.summary.length > 75 ? "..." : ""}
                </p>
                <div className="task-info">
                  <TaskTags
                    task={task}
                    taskSubmissionCount={task.submissionCount}
                    userSubmissions={submissions}
                    userId={user?._id}
                    isDashboard={isDashboard}
                  />
                </div>
              </NavLink>
            </li>
          );
        })}
      </ul>
      <PaginationContainer
        length={length}
        currentPage={page}
        setPage={setPage}
        elementsPerPage={10}
      />
    </div>
  );
}
