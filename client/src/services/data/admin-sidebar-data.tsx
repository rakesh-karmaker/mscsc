import type { ReactNode } from "react";
import FaCalendarAlt from "~icons/fa-solid/calendar-alt";
import FaEnvelopeSquare from "~icons/fa/envelope-square";
import FaTasks from "~icons/fa-solid/tasks";
import FaHouse from "~icons/fa6-solid/house";
import FaPlus from "~icons/fa6-solid/plus";
import FaUser from "~icons/fa6-solid/user";

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
