import { useUser } from "@/Contexts/UserContext";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

import "./AdminPanel.css";

const AdminPanel = () => {
  const { user } = useUser();

  return (
    <main id="admin">
      <Sidebar name={user?.name} image={user?.image} />
      <div className="admin-panel-container">
        <div>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AdminPanel;
