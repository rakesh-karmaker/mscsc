import type { AdminSidebarLinkDataType } from "@/services/data/admin-sidebar-data";
import { Tooltip } from "@mui/material";
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
        <Tooltip title={data.name} placement="right" arrow>
          <span className="truncate max-w-[15ch]">{data.name}</span>
        </Tooltip>
      </NavLink>
    </li>
  );
}
