import { useUser } from "@/contexts/UserContext";
import { NavLink } from "react-router-dom";

const Avatar = () => {
  const { user } = useUser();
  const { slug, image, name } = user;
  return (
    <NavLink to={`/member/${slug}`} title="Profile" id="avatar">
      <img src={image} alt={`Profile picture of ${name}`} />
    </NavLink>
  );
};

export default Avatar;
