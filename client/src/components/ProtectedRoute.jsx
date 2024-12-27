import { useUser } from "@/Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [isUserChecked, setIsUserChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (user === null || user.role !== "admin") {
        navigate("/register", { replace: true });
      } else {
        setIsUserChecked(true);
      }
    }
  }, [navigate, user, isLoading]);

  if (isLoading || !isUserChecked) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
