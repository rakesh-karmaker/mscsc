import { useUser } from "@/Contexts/UserContext";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

import "./AdminPanel.css";

const Admin = () => {
  const { user } = useUser();

  return (
    <main id="admin">
      <Sidebar name={user?.name} image={user?.image} />
      <Outlet />
    </main>
  );
};

export default Admin;
