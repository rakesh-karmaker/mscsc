import { NavLink } from "react-router-dom";

const ActivityNavLink = (props) => {
  const { name, children, active, setTag, search } = props;
  const capitalizeName = name.charAt(0).toUpperCase() + name.slice(1);
  const url = props?.admin ? "/admin/activities" : "/activities";

  return (
    <li>
      <NavLink
        className={(isActive) =>
          "activities-nav-link" + (active ? " active" : "")
        }
        nav-type={name}
        to={active && search === "" ? url : `${url}?tag=${name}`}
        aria-label={`Sort the activities by ${capitalizeName}`}
        onClick={() => (search !== "" ? setTag(name) : active && setTag(""))}
      >
        {children} <span>{capitalizeName}</span>
      </NavLink>
    </li>
  );
};

export default ActivityNavLink;
