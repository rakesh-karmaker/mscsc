import { useUser } from "@/Contexts/UserContext";
import { useMember } from "@/admin/contexts/MemberContext";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";

import "./AdminPanel.css";

const Admin = () => {
  const { user } = useUser();
  const { members } = useMember();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && members) {
      setLoading(false);
    }
  }, [user, members]);

  return (
    <main id="admin">
      {!loading ? (
        <>
          <Sidebar name={user.name} image={user.image} />
          <Outlet />
        </>
      ) : (
        <p
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Loading...
        </p>
      )}
    </main>
  );
};

export default Admin;
