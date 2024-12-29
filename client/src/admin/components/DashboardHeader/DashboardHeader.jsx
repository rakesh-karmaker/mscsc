import { NavLink } from "react-router-dom";
import "./DashboardHeader.css";

const DashboardHeader = ({ title, children }) => {
  return (
    <div className="dashboard-header">
      <div>
        <h1>{title}</h1>
        <p>{children}</p>
      </div>
      {window.innerWidth > 1530 && (
        <NavLink to="/" className="primary-button">
          Home Page
        </NavLink>
      )}
    </div>
  );
};

export default DashboardHeader;
