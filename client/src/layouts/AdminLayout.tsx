import { useUser } from "@/contexts/UserContext";
import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import AdminSidebar from "./adminSidebar/AdminSidebar";

export default function AdminLayout(): ReactNode {
  const { user } = useUser();

  return (
    <main
      id="admin"
      className="w-full min-w-screen h-[clamp(500px,100svh,100%)] flex !flex-row justify-between max-[1530px]:!flex-col max-[1530px]:!items-start max-[1530px]:!p-7.5 max-[1530px]:!justify-start"
    >
      <AdminSidebar name={user?.name || ""} image={user?.image || ""} />
      <div className="admin-panel-container w-full h-full flex justify-center items-center !ml-[270px] max-[1530px]:!ml-0 max-[1530px]:!mt-5">
        <div className="flex-1 h-full min-h-screen w-full max-w-max-width !p-7.5 flex flex-col gap-10 justify-start max-[1530px]:!p-0 max-[1530px]:min-h-0">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
