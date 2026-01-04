import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "@/components/ui/loader/loader";

// Lazy load error pages
const NotFound = lazy(() => import("@/pages/error-pages/not-found"));
const ServerError = lazy(() => import("@/pages/error-pages/server-error"));
const BadRequest = lazy(() => import("@/pages/error-pages/bad-request"));
const Unauthorized = lazy(() => import("@/pages/error-pages/unauthorized"));

// Layouts
import { publicRoutes } from "./public-routes";
import { authRoutes } from "./auth-routes";
import { adminRoutes } from "./admin-routes";
import App from "@/app";

// Router configuration for navigating between pages
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [publicRoutes, authRoutes, adminRoutes], // Merged routes
    errorElement: (
      <Suspense fallback={<Loader />}>
        <ServerError />
      </Suspense>
    ),
  },
  {
    path: "400",
    element: (
      <Suspense fallback={<Loader />}>
        <BadRequest />
      </Suspense>
    ),
  },
  {
    path: "401",
    element: (
      <Suspense fallback={<Loader />}>
        <Unauthorized />
      </Suspense>
    ),
  },
  {
    path: "500",
    element: (
      <Suspense fallback={<Loader />}>
        <ServerError />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loader />}>
        <NotFound />
      </Suspense>
    ),
  },
]);
