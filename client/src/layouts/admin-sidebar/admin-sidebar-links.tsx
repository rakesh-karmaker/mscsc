import type { Dispatch, ReactNode, SetStateAction } from "react";
import AdminSidebarLink from "./admin-sidebar-link";
import { adminSidebarLinkData } from "@/services/data/admin-sidebar-data";

type AdminSidebarLinkProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AdminSidebarLinks({
  isSidebarOpen,
  setIsSidebarOpen,
}: AdminSidebarLinkProps): ReactNode {
  return (
    <menu className="sidebar-links">
      <AdminSidebarLink
        data={adminSidebarLinkData[0]}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <li>
        <p className="sub-text">Members</p>
        <ul>
          {adminSidebarLinkData.slice(1, 4).map((link) => (
            <AdminSidebarLink
              key={link.name}
              data={link}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          ))}
        </ul>
      </li>

      <li>
        <p className="sub-text">Activities</p>
        <ul>
          {adminSidebarLinkData.slice(4, 6).map((link) => (
            <AdminSidebarLink
              key={link.name}
              data={link}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          ))}
        </ul>
      </li>

      <li>
        <p className="sub-text">Tasks</p>
        <ul>
          {adminSidebarLinkData.slice(6, 8).map((link) => (
            <AdminSidebarLink
              key={link.name}
              data={link}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          ))}
        </ul>
      </li>

      <li>
        <p className="sub-text">Club Inbox</p>
        <ul>
          <AdminSidebarLink
            data={adminSidebarLinkData[8]}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </ul>
      </li>
    </menu>
  );
}
