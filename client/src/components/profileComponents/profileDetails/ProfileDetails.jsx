import { NavLink } from "react-router-dom";
import "./ProfileDetails.css";

const ProfileDetails = ({ data, isOwner }) => {
  const { name, role, batch, branch, reason } = data;
  const capitalRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="user-info">
      <div className="user-name-role">
        <div className="user-name-container">
          <h1 className="user-name">{name}</h1>
          <p className="user-role">{capitalRole}</p>
        </div>
        {role === "admin" && isOwner && (
          <NavLink to="/admin/dashboard" className="primary-button">
            Admin Panel
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
};

export default ProfileDetails;
