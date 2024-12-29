import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ name, image }) => {
  const [sidebarState, setSidebarState] = useState(false);

  return (
    <aside className="sidebar-container">
      {window.innerWidth <= 1530 && (
        <div className="sidebar-header">
          <button
            className="sidebar-toggle mobile"
            onClick={() => setSidebarState(!sidebarState)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <NavLink to="/" className="primary-button">
            Home Page
          </NavLink>
        </div>
      )}
      <div id="sidebar" className={sidebarState ? "sidebar-active" : ""}>
        <nav>
          <div className="mscsc-name">
            <div className="mscsc-name-container">
              <h2>MSCSC</h2>
              {window.innerWidth <= 1530 && (
                <button
                  className="sidebar-toggle"
                  onClick={() => setSidebarState(!sidebarState)}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
            <p className="sub-text">Admin Panel</p>
          </div>

          <Welcome name={name} image={image} />

          <SidebarLinks
            sidebarState={sidebarState}
            setSidebarState={setSidebarState}
          />
        </nav>

        <p className="copyright">© 2024 MSCSC</p>
      </div>
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

const SidebarLinks = ({ sidebarState, setSidebarState }) => {
  const links = [
    {
      name: "Dashboard",
      icon: "fa-solid fa-house",
      to: "/admin/dashboard",
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
      <SidebarLink
        data={links[0]}
        sidebarState={sidebarState}
        setSidebarState={setSidebarState}
      />
      <li>
        <p className="sub-text">Club Data</p>
        <ul>
          <SidebarLink
            data={links[1]}
            sidebarState={sidebarState}
            setSidebarState={setSidebarState}
          />
          <SidebarLink
            data={links[2]}
            sidebarState={sidebarState}
            setSidebarState={setSidebarState}
          />
        </ul>
      </li>
      <li>
        <p className="sub-text">Club Inbox</p>
        <ul>
          <SidebarLink
            data={links[3]}
            sidebarState={sidebarState}
            setSidebarState={setSidebarState}
          />
        </ul>
      </li>
    </menu>
  );
};

const SidebarLink = ({ data, sidebarState, setSidebarState }) => {
  return (
    <li>
      <NavLink
        to={data.to}
        className="sidebar-link"
        onClick={() => setSidebarState(!sidebarState)}
      >
        <i className={data.icon}></i>
        <span>{data.name}</span>
      </NavLink>
    </li>
  );
};

export default Sidebar;
