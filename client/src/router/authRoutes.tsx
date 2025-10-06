import { lazy, Suspense } from "react";
import Loader from "@/components/ui/loader/Loader";

// Lazy load pages
const Auth = lazy(() => import("@/pages/auth/Auth"));
const ForgotPassword = lazy(
  () => import("@/pages/forgotPassword/ForgotPassword")
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
          <ForgotPassword />
        </Suspense>
      ),
    },
  ],
};
