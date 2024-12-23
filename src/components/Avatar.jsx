import { useUser } from "@/Contexts/UserContext";
import { NavLink } from "react-router-dom";
import { object } from "zod";

const Avatar = () => {
  const { user } = useUser();
  const { image, name } = user;
  const avatarStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    objectPosition: "center center",
  };
  return (
    <NavLink to="/profile" style={{ height: "50px" }} title="Profile">
      <img
        style={avatarStyle}
        src={`http://localhost:5000/${image}`}
        alt={`Profile picture of ${name}`}
      />
    </NavLink>
  );
};

export default Avatar;
