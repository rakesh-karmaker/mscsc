import type { Dispatch, ReactNode, SetStateAction } from "react";
import { NavLink } from "react-router-dom";

type ActivityNavLinkProps = {
  name: string;
  children: ReactNode;
  active: boolean;
  setTag: Dispatch<SetStateAction<string>>;
  search: string;
  admin?: boolean;
};

export default function ActivityNavLink({
  name,
  children,
  active,
  setTag,
  search,
  admin,
}: ActivityNavLinkProps): ReactNode {
  const capitalizeName = name.charAt(0).toUpperCase() + name.slice(1);
  const url = admin ? "/admin/activities" : "/activities";

  return (
    <li>
      <NavLink
        className={(_) => "activities-nav-link" + (active ? " active" : "")}
        nav-type={name}
        to={active && search === "" ? url : `${url}?tag=${name}`}
        aria-label={`Sort the activities by ${capitalizeName}`}
        onClick={() => (search !== "" ? setTag(name) : active && setTag(""))}
      >
        {children} <span>{capitalizeName}</span>
      </NavLink>
    </li>
  );
}
