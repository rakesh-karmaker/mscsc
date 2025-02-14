import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = ({ name, image }) => {
  const [sidebarState, setSidebarState] = useState(false);

  let start;
  // add a swipe event listener to the sidebar
  window.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1 && window.innerWidth <= 1530) {
      start = e.touches.item(0).clientX;
    } else {
      start = null;
    }
  });

  window.addEventListener("touchend", (e) => {
    const offset = 100;
    if (start && window.innerWidth <= 1530) {
      const end = e.changedTouches.item(0).clientX;
      if (end - start > offset) {
        setSidebarState(true);
      }
      if (start - end > offset) {
        setSidebarState(false);
      }
    }
  });

  return (
    <aside className="sidebar-container">
      <div>
        {window.innerWidth <= 1530 && (
          <div className="sidebar-header">
            <button
              className="sidebar-toggle mobile"
              onClick={() => setSidebarState(!sidebarState)}
            >
              <FontAwesomeIcon icon="fa-solid fa-bars" />
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
                    <FontAwesomeIcon icon="fa-solid fa-times" />
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

          <p className="copyright">© {new Date().getFullYear()} MSCSC</p>
        </div>
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
      name: "Admins",
      icon: "fa-solid fa-user-secret",
      to: "/admin/admins",
    },
    {
      name: "Executives",
      icon: "fa-solid fa-user-tie",
      to: "/admin/executives",
    },
    {
      name: "Members",
      icon: "fa-solid fa-user",
      to: "/admin/members",
    },
    {
      name: "Activities",
      icon: "fa-regular fa-calendar-days",
      to: "/admin/activities",
    },
    {
      name: "Add New",
      icon: "fa-solid fa-plus",
      to: "/admin/add-activity",
    },
    {
      name: "Tasks",
      icon: "fa-solid fa-list-check",
      to: "/admin/tasks",
    },
    {
      name: "Add New",
      icon: "fa-solid fa-plus",
      to: "/admin/add-task",
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
        <p className="sub-text">Members</p>
        <ul>
          {links.slice(1, 4).map((link) => (
            <SidebarLink
              key={link.name}
              data={link}
              sidebarState={sidebarState}
              setSidebarState={setSidebarState}
            />
          ))}
        </ul>
      </li>

      <li>
        <p className="sub-text">Activities</p>
        <ul>
          {links.slice(4, 6).map((link) => (
            <SidebarLink
              key={link.name}
              data={link}
              sidebarState={sidebarState}
              setSidebarState={setSidebarState}
            />
          ))}
        </ul>
      </li>

      <li>
        <p className="sub-text">Tasks</p>
        <ul>
          {links.slice(6, 8).map((link) => (
            <SidebarLink
              key={link.name}
              data={link}
              sidebarState={sidebarState}
              setSidebarState={setSidebarState}
            />
          ))}
        </ul>
      </li>

      <li>
        <p className="sub-text">Club Inbox</p>
        <ul>
          <SidebarLink
            data={links[8]}
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
        <FontAwesomeIcon icon={data.icon} />
        <span>{data.name}</span>
      </NavLink>
    </li>
  );
};

export default Sidebar;
