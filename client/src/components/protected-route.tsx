import { useUser } from "@/contexts/user-context";
import { useNavigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { requireMinimumRole, type Role } from "@/utils/require-minimum-role";

export default function ProtectedRoute({
  children,
  requiredRole = "executive",
}: {
  children: ReactNode;
  requiredRole: Role;
}): ReactNode {
  const { user, isVerifying } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !isVerifying &&
      (user === null || !requireMinimumRole(user.role, requiredRole))
    ) {
      navigate("/401", { replace: true });
    }
  }, [user, navigate, isVerifying]);

  if (
    !isVerifying &&
    user !== null &&
    requireMinimumRole(user.role, requiredRole)
  ) {
    return children;
  }
}
