import type { Submission, Task } from "@/types/task-types";
import getPosition from "@/utils/get-position";
import type { ReactNode } from "react";
import FaCrown from "~icons/fa-solid/crown";
import { NavLink } from "react-router-dom";
import {
  requireMinimumRole,
  ROLES,
  type Role,
} from "@/utils/require-minimum-role";

type TaskSubmitterProps = {
  submitter: Submission;
  value: number | ReactNode;
  url: string;
  task?: Task;
  role: Role;
};

export default function TaskSubmitter({
  submitter,
  value,
  url,
  role,
  ...rest
}: TaskSubmitterProps) {
  const {
    name,
    branch,
    batch,
    image,
    memberId,
    isImageHidden,
    isImageVerified,
  } = submitter;

  const position = rest?.task && getPosition(rest?.task, memberId || "");

  return (
    <NavLink to={url} className={"top-submitter"}>
      <div className="member-info">
        <img
          src={
            requireMinimumRole(role, ROLES.OBSERVER)
              ? image
              : isImageHidden || !isImageVerified
                ? "/executive-members/placeholderpfp.webp"
                : image
          }
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
