import { useUser } from "@/contexts/UserContext";
import { NavLink } from "react-router-dom";

const Avatar = () => {
  const { user } = useUser();
  const { _id, image, name } = user;
  return (
    <NavLink to={`/member/${_id}`} title="Profile" id="avatar">
      <img src={image} alt={`Profile picture of ${name}`} />
    </NavLink>
  );
};

export default Avatar;
