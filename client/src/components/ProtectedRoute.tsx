import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}): ReactNode {
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
}
