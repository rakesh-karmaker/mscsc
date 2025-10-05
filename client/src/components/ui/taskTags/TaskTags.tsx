import getPosition from "@/utils/getPosition";
import type { Task, TaskPreview } from "@/types/taskTypes";
import { FaNewspaper } from "react-icons/fa6";
import { FaCheck, FaClock, FaCrown, FaPenNib, FaUser } from "react-icons/fa";
import type { ReactNode } from "react";
import formatDate from "@/utils/formatDate";

import "./taskTags.css";

type TaskTagsProps = {
  task: TaskPreview | Task;
  taskSubmissionCount: number;
  userSubmissions?: string[];
  username?: string;
  admin?: boolean;
};

export default function TaskTags({
  task,
  taskSubmissionCount,
  userSubmissions,
  username,
  admin,
}: TaskTagsProps): ReactNode {
  const categoryIcons: Record<string, ReactNode> = {
    "article writing": <FaNewspaper />,
    "poster design": <FaPenNib />,
  };

  const position = getPosition(task, username ?? "");

  return (
    <>
      {userSubmissions?.includes(task._id.toString()) && !admin ? (
        <p className="task-icons flex items-center gap-1">
          {position ? (
            <>
              <FaCrown className={"winner " + position} />
              <span style={{ textTransform: "capitalize" }}>{position}</span>
            </>
          ) : (
            <>
              <FaCheck className="done" />
              <span>Submitted</span>
            </>
          )}
        </p>
      ) : null}
      <p
        className={
          "task-date flex gap-1 items-center" +
          (new Date(task.deadline) > new Date() ? " pending" : "")
        }
      >
        <FaClock />
        <span>{formatDate(task.deadline)}</span>
      </p>
      <p className="task-type">
        {categoryIcons[task.category]}
        <span>{task.category}</span>
      </p>
      <p className="task-submissions">
        <FaUser />
        <span>{taskSubmissionCount} submissions</span>
      </p>
    </>
  );
}
