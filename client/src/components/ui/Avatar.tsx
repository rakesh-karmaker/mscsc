import { useUser } from "@/contexts/UserContext";
import type React from "react";
import { NavLink } from "react-router-dom";

export default function Avatar(): React.ReactNode {
  const { user } = useUser();
  return (
    <NavLink to={`/member/${user?.slug}`} title="Profile" id="avatar">
      <img src={user?.image} alt={`Profile picture of ${user?.name}`} />
    </NavLink>
  );
}
