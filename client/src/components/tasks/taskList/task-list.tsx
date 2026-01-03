import { NavLink } from "react-router-dom";
import type { TaskPreview } from "@/types/task-types";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import Empty from "@/components/ui/empty/empty";
import PaginationContainer from "@/components/ui/pagination-container/pagination-container";
import TaskTags from "@/components/ui/task-tags/task-tags";

import "./task-list.css";

type TaskListProps = {
  tasks: TaskPreview[];
  length: number;
  page: number;
  submissions?: string[];
  username?: string;
  admin?: boolean;
  setPage: Dispatch<SetStateAction<number>>;
};

export default function TaskList({
  tasks,
  length,
  page,
  setPage,
  submissions,
  username,
  admin,
}: TaskListProps): ReactNode {
  // check if there are tasks to display
  if (tasks?.length === 0) return <Empty />;

  return (
    <div className="task-container">
      <ul className="tasks">
        {tasks?.map((task) => {
          return (
            <li key={task._id}>
              <NavLink
                to={`${admin ? "/admin" : ""}/task/${task.slug}${
                  !admin && username ? `?user=${username}` : ""
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
                    username={username}
                    admin={admin}
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
        elementsPerPage={18}
      />
    </div>
  );
}
