import { NavLink } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <section className="admin-dashboard">
      <DashboardHeader />
      <div className="dashboard-info"></div>
    </section>
  );
};

const QuickAccess = () => {
  const quickAccessData = [
    {
      icon: "fa-solid fa-calendar-days",
      heading: "Add a new Activity",
      text: "You can add a new workshop details, article, a member’s achievement and new upcoming events. So the users can see them, learn about them and join the activities to expand their domain of knowledge and learn about several things.",
      link: "/admin/activities",
      linkText: "Add Activity",
    },
  ];
  return (
    <div className="quick-access">
      {quickAccessData.map((data) => (
        <QuickAccessCard data={data} key={data.heading} />
      ))}
    </div>
  );
};

const QuickAccessCard = ({ data }) => {
  const { icon, heading, text, link, linkText } = data;

  return (
    <div className="quick-access-card">
      <p className="quick-access-card-icon">
        <i class={icon}></i>
      </p>

      <h3 className="quick-access-card-heading">{heading}</h3>

      <p className="quick-access-card-text">{text}</p>

      <NavLink to={link} className="primary-button">
        {linkText}
      </NavLink>
    </div>
  );
};

const DashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to the Admin Dashboard</p>
      </div>
      <NavLink to="/" className="primary-button">
        Home Page
      </NavLink>
    </div>
  );
};

export default AdminDashboard;
