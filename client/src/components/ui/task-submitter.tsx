import type { Task, TaskSubmitterType } from "@/types/task-types";
import getPosition from "@/utils/get-position";
import type { ReactNode } from "react";
import { FaCrown } from "react-icons/fa";
import { NavLink } from "react-router-dom";

type TaskSubmitterProps = {
  submitter: TaskSubmitterType;
  value: number | ReactNode;
  url: string;
  task?: Task;
};

export default function TaskSubmitter({
  submitter,
  value,
  url,
  ...rest
}: TaskSubmitterProps) {
  const { name, branch, batch, image, username, isImageHidden } = submitter;

  const position = rest?.task && getPosition(rest?.task, username);

  return (
    <NavLink to={url} className={"top-submitter"}>
      <div className="member-info">
        <img
          src={isImageHidden ? "/executive-members/placeholderpfp.webp" : image}
          alt={name}
        />
        <div>
          <p className="member-name flex gap-1 items-center">
            {name}
            {position && <FaCrown className={"winner " + position} />}
          </p>
          <p className="member-branch-batch">
            {branch}, {batch}
          </p>
        </div>
      </div>
      <p className="value flex gap-0.5 items-end">{value}</p>
    </NavLink>
  );
}
