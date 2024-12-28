import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ name, image }) => {
  return (
    <aside id="sidebar">
      <nav>
        <div className="mscsc-name">
          <h2>MSCSC</h2>
          <p className="sub-text">Admin Panel</p>
        </div>

        <Welcome name={name} image={image} />

        <SidebarLinks />
      </nav>

      <p className="copyright">© 2024 MSCSC</p>
    </aside>
  );
};

const Welcome = ({ name, image }) => {
  return (
    <div className="welcome">
      <img src={image} alt={`Pic of ${name}`} />
      <div>
        <h2>{name}</h2>
        <p className="sub-text">Welcome</p>
      </div>
    </div>
  );
};

const SidebarLinks = () => {
  const links = [
    {
      name: "Dashboard",
      icon: "fa-solid fa-house",
      to: "/admin",
    },
    {
      name: "Members",
      icon: "fa-solid fa-user",
      to: "/admin/members",
    },
    {
      name: "Activities",
      icon: "fa-solid fa-calendar-days",
      to: "/admin/activities",
    },
    {
      name: "Messages",
      icon: "fa-solid fa-square-envelope",
      to: "/admin/messages",
    },
  ];

  return (
    <menu className="sidebar-links">
      <SidebarLink data={links[0]} />
      <li>
        <p className="sub-text">Club Data</p>
        <ul>
          <SidebarLink data={links[1]} />
          <SidebarLink data={links[2]} />
        </ul>
      </li>
      <li>
        <p className="sub-text">Club Inbox</p>
        <ul>
          <SidebarLink data={links[3]} />
        </ul>
      </li>
    </menu>
  );
};

const SidebarLink = ({ data }) => {
  return (
    <li>
      <NavLink to={data.to} className="sidebar-link">
        <i className={data.icon}></i>
        <span>{data.name}</span>
      </NavLink>
    </li>
  );
};

export default Sidebar;
