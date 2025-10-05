import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "@/components/ui/loader/Loader";

// Lazy load error pages
const NotFound = lazy(() => import("@/pages/errorPages/NotFound"));
const ServerError = lazy(() => import("@/pages/errorPages/ServerError"));
const BadRequest = lazy(() => import("@/pages/errorPages/BadRequest"));
const Unauthorized = lazy(() => import("@/pages/errorPages/Unauthorized"));

// Layouts
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";
import { adminRoutes } from "./adminRoutes";
import App from "@/App";

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
