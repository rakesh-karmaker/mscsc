import { NavLink } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Welcome from "./Welcome";
import AdminSidebarLinks from "./AdminSidebarLinks";

import "./adminSidebar.css";

export default function AdminSidebar({
  name,
  image,
}: {
  name: string;
  image: string;
}): ReactNode {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <aside className="sidebar-container">
      <div>
        {window.innerWidth <= 1530 && (
          <div className="sidebar-header">
            <button
              className="sidebar-toggle mobile"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FaBars />
            </button>
            <NavLink to="/" className="primary-button">
              Home Page
            </NavLink>
          </div>
        )}
        <div id="sidebar" className={isSidebarOpen ? "sidebar-active" : ""}>
          <nav>
            <div className="mscsc-name">
              <div className="mscsc-name-container">
                <h2>MSCSC</h2>
                {window.innerWidth <= 1530 && (
                  <button
                    className="sidebar-toggle"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <p className="sub-text">Admin Panel</p>
            </div>

            <Welcome name={name} image={image} />

            <AdminSidebarLinks
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </nav>

          <p className="copyright">© {new Date().getFullYear()} MSCSC</p>
        </div>
      </div>
    </aside>
  );
}
