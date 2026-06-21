import { useUser } from "@/contexts/user-context";
import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import AdminSidebar from "./admin-sidebar/admin-sidebar";
import { useQuery } from "@tanstack/react-query";
import { getAllEvents } from "@/lib/api/event/event";
import { requireMinimumRole, ROLES } from "@/utils/require-minimum-role";

export default function AdminLayout(): ReactNode {
  const { user } = useUser();

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getAllEvents,
    enabled: user !== null && requireMinimumRole(user.role, ROLES.OBSERVER), // Only fetch events if user is available
  });

  return (
    <main
      id="admin"
      className="w-full min-w-screen h-[clamp(500px,100svh,100%)] flex flex-row! justify-between max-[1530px]:flex-col! max-[1530px]:items-start! max-[1530px]:p-7.5! max-[1530px]:justify-start!"
    >
      <AdminSidebar
        name={user?.name || ""}
        image={user?.image || ""}
        events={eventsData?.data || []}
        isEventsFetching={isLoading}
        role={user?.role || ROLES.MEMBER}
      />
      <div className="admin-panel-container w-full h-full flex justify-center items-center ml-67.5! max-[1530px]:ml-0! max-[1530px]:mt-5!">
        <div className="flex-1 h-full min-h-screen w-full p-7.5! flex flex-col gap-10 justify-start max-[1530px]:p-0! max-[1530px]:min-h-0">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
