import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmptyData from "@/components/UI/EmptyData/EmptyData";
import Pagination from "@/components/UI/Pagination/Pagination";
import dateFormat from "@/utils/dateFormat";

import "./TaskList.css";

const TaskList = ({ tasks, length, page, setPage, submissions, username }) => {
  if (length === 0) return <EmptyData />;

  const categoryIcons = {
    "article writing": <FontAwesomeIcon icon="fa-solid fa-newspaper" />,
    "poster design": <FontAwesomeIcon icon="fa-solid fa-pen-nib" />,
  };

  return (
    <div className="task-container">
      <ul className="tasks">
        {tasks?.map((task) => {
          return (
            <li key={task._id}>
              <NavLink to={`/task/${task.slug}`} className="task">
                <p className="task-name">{task.name}</p>
                <p className="task-summary">
                  {task.summary.slice(0, 75)}
                  {task.summary.length > 75 ? "..." : ""}
                </p>
                <div className="task-info">
                  {submissions?.includes(task._id.toString()) ? (
                    <p className="task-icons">
                      {task?.champion === username ? (
                        <FontAwesomeIcon
                          icon="fa-solid fa-crown"
                          className="champion"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon="fa-solid fa-check"
                          className="done"
                        />
                      )}
                    </p>
                  ) : null}
                  <p className="task-date">
                    <FontAwesomeIcon icon="fa-solid fa-clock" />
                    <span>{dateFormat(task.deadline)}</span>
                  </p>
                  <p className="task-type">
                    {categoryIcons[task.taskType]}
                    <span>{task.taskType}</span>
                  </p>
                  <p className="task-submissions">
                    <FontAwesomeIcon icon="fa-solid fa-user" />
                    <span>{task?.submission?.length} submissions</span>
                  </p>
                </div>
              </NavLink>
            </li>
          );
        })}
      </ul>
      <Pagination
        length={length}
        currentPage={page}
        setPage={setPage}
        elementsPerPage={18}
      />
    </div>
  );
};

export default TaskList;
