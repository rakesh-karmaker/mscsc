import { lazy, Suspense } from "react";
import "@/global.css";
import Loader from "@/components/UI/Loader/Loader";
import Auth from "@/pages/auth/Auth";

// Lazy load pages
const ResetPassword = lazy(() =>
  import("@/pages/resetPassword/ForgotPassword")
);

export const authRoutes = {
  path: "/auth",
  children: [
    {
      path: "/auth/register",
      element: (
        <Suspense fallback={<Loader />}>
          <Auth method="Register" />
        </Suspense>
      ),
    },
    {
      path: "/auth/login",
      element: (
        <Suspense fallback={<Loader />}>
          <Auth method="Login" />
        </Suspense>
      ),
    },
    {
      path: "/auth/forgot-password",
      element: (
        <Suspense fallback={<Loader />}>
          <ResetPassword />
        </Suspense>
      ),
    },
  ],
};
