import { Link, NavLink } from "react-router-dom";

const UserInfo = ({ data, isOwner }) => {
  const { name, role, batch, branch, reason } = data;
  const capitalRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="user-info">
      <div>
        <div className="user-name-container">
          <h1 className="user-name">{name}</h1>
          {isOwner && (
            <NavLink to="/admin" className="primary-button">
              Admin Panel
            </NavLink>
          )}
        </div>
        <p className="user-role">{capitalRole}</p>
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

export default UserInfo;
