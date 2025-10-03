import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import "@/global.css";
import App from "@/App.jsx";
import Loader from "@/components/UI/Loader/Loader";

// Lazy load error pages
const NotFound = lazy(() => import("@/pages/Errors/NotFound"));
const ServerError = lazy(() => import("@/pages/Errors/ServerError"));
const BadRequest = lazy(() => import("@/pages/Errors/BadRequest"));
const Unauthorized = lazy(() => import("@/pages/Errors/Unauthorized"));

// Layouts
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";
import { adminRoutes } from "./adminRoutes";

// Router configuration for navigating between pages
const router = createBrowserRouter([
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

export default router;
