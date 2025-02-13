import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dateFormat from "@/utils/dateFormat";

const TaskTags = ({ task, submissions, username }) => {
  const categoryIcons = {
    "article writing": <FontAwesomeIcon icon="fa-solid fa-newspaper" />,
    "poster design": <FontAwesomeIcon icon="fa-solid fa-pen-nib" />,
  };

  return (
    <>
      {submissions?.includes(task._id.toString()) ? (
        <p className="task-icons">
          {task?.champion === username ? (
            <>
              <FontAwesomeIcon icon="fa-solid fa-crown" className="champion" />
              <span>Champion</span>
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
        <span>{task?.submissions?.length} submissions</span>
      </p>
    </>
  );
};

export default TaskTags;
