import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dateFormat from "@/utils/dateFormat";
import getPosition from "@/utils/getPosition";
import "./TaskTags.css";

const TaskTags = ({ task, submissions, username, admin }) => {
  const categoryIcons = {
    "article writing": <FontAwesomeIcon icon="fa-solid fa-newspaper" />,
    "poster design": <FontAwesomeIcon icon="fa-solid fa-pen-nib" />,
  };

  const position = getPosition(task, username);

  return (
    <>
      {submissions?.includes(task._id.toString()) && !admin ? (
        <p className="task-icons">
          {position ? (
            <>
              <FontAwesomeIcon
                icon="fa-solid fa-crown"
                className={"winner " + position}
              />
              <span style={{ textTransform: "capitalize" }}>{position}</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon="fa-solid fa-check" className="done" />
              <span>Submitted</span>
            </>
          )}
        </p>
      ) : null}
      <p
        className={
          "task-date" + (new Date(task.deadline) > new Date() ? " pending" : "")
        }
      >
        <FontAwesomeIcon icon="fa-solid fa-clock" />
        <span>{dateFormat(task.deadline)}</span>
      </p>
      <p className="task-type">
        {categoryIcons[task.category]}
        <span>{task.category}</span>
      </p>
      <p className="task-submissions">
        <FontAwesomeIcon icon="fa-solid fa-user" />
        <span>
          {task?.submissionCount ?? task?.submissions?.length} submissions
        </span>
      </p>
    </>
  );
};

export default TaskTags;
