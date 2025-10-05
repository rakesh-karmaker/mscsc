import type { AdminSidebarLinkDataType } from "@/services/data/AdminSidebarLinkData";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { NavLink } from "react-router-dom";

type AdminSidebarLinkProps = {
  data: AdminSidebarLinkDataType;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AdminSidebarLink({
  data,
  isSidebarOpen,
  setIsSidebarOpen,
}: AdminSidebarLinkProps): ReactNode {
  return (
    <li>
      <NavLink
        to={data.to}
        className="sidebar-link"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {data.icon}
        <span>{data.name}</span>
      </NavLink>
    </li>
  );
}
