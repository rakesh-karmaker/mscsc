import type { ReactNode } from "react";
import { FaCalendarAlt, FaEnvelopeSquare, FaTasks } from "react-icons/fa";
import {
  FaHouse,
  FaPlus,
  FaUser,
  FaUserSecret,
  FaUserTie,
} from "react-icons/fa6";

export type AdminSidebarLinkDataType = {
  name: string;
  icon: ReactNode;
  to: string;
};

export const adminSidebarLinkData: AdminSidebarLinkDataType[] = [
  {
    name: "Dashboard",
    icon: <FaHouse />,
    to: "/admin/dashboard",
  },
  {
    name: "Admins",
    icon: <FaUserSecret />,
    to: "/admin/admins",
  },
  {
    name: "Executives",
    icon: <FaUserTie />,
    to: "/admin/executives",
  },
  {
    name: "Members",
    icon: <FaUser />,
    to: "/admin/members",
  },
  {
    name: "Activities",
    icon: <FaCalendarAlt />,
    to: "/admin/activities",
  },
  {
    name: "Add New",
    icon: <FaPlus />,
    to: "/admin/add-activity",
  },
  {
    name: "Tasks",
    icon: <FaTasks />,
    to: "/admin/tasks",
  },
  {
    name: "Add New",
    icon: <FaPlus />,
    to: "/admin/add-task",
  },
  {
    name: "Messages",
    icon: <FaEnvelopeSquare />,
    to: "/admin/messages",
  },
  {
    name: "Add New",
    icon: <FaPlus />,
    to: "/admin/add-event",
  },
];
