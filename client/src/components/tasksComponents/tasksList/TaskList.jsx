import { NavLink } from "react-router-dom";
import EmptyData from "@/components/UI/EmptyData/EmptyData";

import "./TaskList.css";
import TaskTags from "@/components/tasksComponents/taskTags/TaskTags";
import PaginationContainer from "@/components/UI/Pagination/Pagination";

const TaskList = ({
  tasks,
  length,
  page,
  setPage,
  submissions,
  username,
  admin,
}) => {
  // check if there are tasks to display
  if (tasks?.length === 0) return <EmptyData />;

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
                    submissions={submissions}
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
};

export default TaskList;
