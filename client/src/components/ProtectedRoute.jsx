import { useUser } from "@/Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null || user?.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return children;
};

export default ProtectedRoute;
