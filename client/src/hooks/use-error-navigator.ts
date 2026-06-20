import { useEffect } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

export type ErrorWithStatus = (Error & { status?: number }) | null;

export function navigateError(
  navigate: NavigateFunction,
  error: ErrorWithStatus,
) {
  const status = error?.status;

  if (status === 400) {
    navigate("/400", { replace: true });
    return;
  }

  if (status === 401) {
    navigate("/401", { replace: true });
    return;
  }

  if (status === 404) {
    navigate("/404", { replace: true });
    return;
  }

  if (status === 500 || status === null || status === undefined) {
    navigate("/500", { replace: true });
  }
}

export default function useErrorNavigator(
  isError: boolean,
  error: ErrorWithStatus,
) {
  const navigate = useNavigate();
  useEffect(() => {
    if (isError) {
      navigateError(navigate, error);
    }
  }, [isError, error, navigate]);
}
