import { NavLink } from "react-router-dom";
import { useState, type ReactNode } from "react";
import FaBars from "~icons/fa-solid/bars";
import LuX from "~icons/lucide/x";
import Welcome from "./welcome";
import AdminSidebarLinks from "./admin-sidebar-links";
import type { Role } from "@/utils/require-minimum-role";

import "./admin-sidebar.css";

export default function AdminSidebar({
  name,
  image,
  events,
  isEventsFetching,
  role,
}: {
  name: string;
  image: string;
  events: {
    eventName: string;
    eventSlug: string;
  }[];
  isEventsFetching: boolean;
  role: Role;
}): ReactNode {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
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
      <aside
        className={`${isSidebarOpen ? "sidebar-active" : ""} sidebar-container h-full`}
      >
        <div className="w-full h-screen overflow-y-auto p-7.5! flex flex-col gap-7.5">
          <div className={`h-full flex flex-col justify-between gap-10`}>
            <nav>
              <div className="mscsc-name">
                <div className="mscsc-name-container">
                  <h2>MSCSC</h2>
                  {window.innerWidth <= 1530 && (
                    <button
                      className="sidebar-toggle"
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                      <LuX />
                    </button>
                  )}
                </div>
                <p className="sub-text">Admin Panel</p>
              </div>

              <Welcome name={name} image={image} />

              <AdminSidebarLinks
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                events={events}
                isEventsFetching={isEventsFetching}
                role={role}
              />
            </nav>

            <p className="max-lg:text-sm pb-3!">
              © {new Date().getFullYear()} MSCSC ||{" "}
              <a
                href="https://rakesh-karmaker.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                Rakesh
              </a>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
