import type { Dispatch, ReactNode, SetStateAction } from "react";
import AdminSidebarLink from "./admin-sidebar-link";
import { adminSidebarLinkData } from "@/services/data/admin-sidebar-data";
import { BiSolidCalendarEvent } from "react-icons/bi";

type AdminSidebarLinkProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  events: {
    eventName: string;
    eventSlug: string;
  }[];
  isEventsFetching: boolean;
};

export default function AdminSidebarLinks({
  isSidebarOpen,
  setIsSidebarOpen,
  events,
  isEventsFetching,
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
          <AdminSidebarLink
            data={adminSidebarLinkData[1]}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </ul>
      </li>

      <li>
        <p className="sub-text">Activities</p>
        <ul>
          {adminSidebarLinkData.slice(2, 4).map((link) => (
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
        <p className="sub-text">Club Inbox</p>
        <ul>
          <AdminSidebarLink
            data={adminSidebarLinkData[6]}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </ul>
      </li>

      <li>
        <p className="sub-text">Events</p>
        <ul>
          {adminSidebarLinkData.slice(7).map((link) => (
            <AdminSidebarLink
              key={link.name}
              data={link}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          ))}
          {isEventsFetching ? (
            <div
              role="status"
              className="max-w-sm animate-pulse flex flex-col gap-2"
            >
              <div className="h-2.5 bg-gray-700 rounded-full w-47 mb-4"></div>
              <div className="h-2.5 bg-gray-700 rounded-full w-40 mb-2.5"></div>
              <div className="h-2.5 bg-gray-700 rounded-full w-47 mb-2.5"></div>
            </div>
          ) : (
            events.map((event) => (
              <AdminSidebarLink
                key={event.eventSlug}
                data={{
                  name: event.eventName,
                  to: event.eventSlug,
                  icon: <BiSolidCalendarEvent />,
                }}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            ))
          )}
        </ul>
      </li>
    </menu>
  );
}
