import { NavLink } from "react-router-dom";
import type { User } from "@/types/user-types";
import capitalize from "@/utils/capitalize";
import { requireMinimumRole, ROLES } from "@/utils/require-minimum-role";

import "./profile-details.css";

export default function ProfileDetails({
  data,
  isOwner,
}: {
  data: User;
  isOwner: boolean;
}) {
  const { name, role, position, batch, branch, reason } = data;

  return (
    <div className="user-info">
      <div className="user-name-position">
        <div className="user-name-container">
          <h1 className="user-name">{name}</h1>
          <p className="user-position">{capitalize(position)}</p>
        </div>
        {requireMinimumRole(role, ROLES.EXECUTIVE) && isOwner && (
          <NavLink to="/admin/dashboard" className="primary-button">
            {capitalize(role)} Panel
          </NavLink>
        )}
      </div>

      <p className="user-school-info">
        SSC Batch: <span>{batch}</span>
      </p>

      <p className="user-school-info">
        School Branch: <span>{branch}</span>
      </p>

      <div>
        <p className="user-reason">Description:</p>
        <p className="user-reason-text">{reason}</p>
      </div>
    </div>
  );
}
