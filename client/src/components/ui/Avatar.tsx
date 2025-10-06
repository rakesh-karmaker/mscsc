import { useUser } from "@/contexts/UserContext";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export default function Avatar(): ReactNode {
  const { user } = useUser();
  return (
    <NavLink to={`/member/${user?.slug}`} title="Profile" id="avatar">
      <img src={user?.image} alt={`Profile picture of ${user?.name}`} />
    </NavLink>
  );
}
