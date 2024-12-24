import { useUser } from "@/Contexts/UserContext";
import { NavLink } from "react-router-dom";

const Avatar = () => {
  const { user } = useUser();
  const { _id, image, name } = user;
  return (
    <NavLink to={`/profile/${_id}`} title="Profile" id="avatar">
      <img
        src={`http://localhost:5000/${image}`}
        alt={`Profile picture of ${name}`}
      />
    </NavLink>
  );
};

export default Avatar;
