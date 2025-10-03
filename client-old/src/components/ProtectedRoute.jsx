import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, isVerifying } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isVerifying && (user === null || user?.role !== "admin")) {
      navigate("/401", { replace: true });
    }
  }, [user, navigate, isVerifying]);

  if (!isVerifying && user !== null && user?.role === "admin") {
    return children;
  }
};

export default ProtectedRoute;
