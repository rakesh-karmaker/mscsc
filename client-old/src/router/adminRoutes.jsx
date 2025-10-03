import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import "@/global.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/UI/Loader/Loader";

// Lazy load admin pages
const AdminDashboard = lazy(() =>
  import("@/components/admin/adminDashboard/AdminDashboard")
);
const MembersDashboard = lazy(() =>
  import("@/components/admin/membersDashboard/MembersDashboard")
);
const ActivitiesDashboard = lazy(() =>
  import("@/components/admin/activitiesDashboard/ActivitiesDashboard")
);
const MessagesDashboard = lazy(() =>
  import("@/components/admin/messagesDashboard/MessagesDashboard")
);
const ActivityForm = lazy(() =>
  import("@/components/admin/components/ActivityForm/ActivityForm")
);
const TasksDashBoard = lazy(() =>
  import("@/components/admin/tasksDashboard/TasksDashboard")
);
const TaskDashboard = lazy(() =>
  import("@/components/admin/tasksDashboard/taskDashboard/TaskDashboard")
);
const TaskForm = lazy(() =>
  import("@/components/admin/components/TaskForm/TaskForm")
);

// Lazy load error pages
const NotFound = lazy(() => import("@/pages/Errors/NotFound"));

// Contexts
import { MessagesProvider } from "@/components/admin/contexts/MessagesContext";
import { MemberProvider } from "@/contexts/MembersContext";
import { ActivitiesProvider } from "@/contexts/ActivitiesContext";
import { TaskProvider } from "@/contexts/TasksContext";

// Layouts
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";

export const adminRoutes = {
  path: "/admin",
  element: (
    <ProtectedRoute>
      <MemberProvider>
        <MessagesProvider>
          <AdminLayout />
        </MessagesProvider>
      </MemberProvider>
    </ProtectedRoute>
  ),
  children: [
    // Redirect to /admin/dashboard
    { path: "/admin", element: <Navigate to="/admin/dashboard" /> },

    // Admin Dashboard Route
    {
      path: "/admin/dashboard",
      element: (
        <Suspense fallback={<Loader />}>
          <AdminDashboard />
        </Suspense>
      ),
    },

    // Admin Members Routes
    {
      path: "/admin/members",
      element: (
        <Suspense fallback={<Loader />}>
          <MembersDashboard />
        </Suspense>
      ),
    },
    {
      path: "/admin/executives",
      element: (
        <Suspense fallback={<Loader />}>
          <MembersDashboard
            type="executive"
            title="Executives"
            des="View all the executives of the club"
          />
        </Suspense>
      ),
    },
    {
      path: "/admin/admins",
      element: (
        <Suspense fallback={<Loader />}>
          <MembersDashboard
            type="admin"
            title="Admins"
            des="View all the admins of the club"
          />
        </Suspense>
      ),
    },

    // Activities Routes
    {
      path: "/admin/activities",
      element: (
        <Suspense fallback={<Loader />}>
          <ActivitiesProvider>
            <ActivitiesDashboard />
          </ActivitiesProvider>
        </Suspense>
      ),
    },
    {
      path: "/admin/add-activity",
      element: (
        <Suspense fallback={<Loader />}>
          <ActivityForm method={"add"} />
        </Suspense>
      ),
    },

    // Tasks Routes
    {
      path: "/admin/tasks",
      element: (
        <Suspense fallback={<Loader />}>
          <TaskProvider>
            <TasksDashBoard />
          </TaskProvider>
        </Suspense>
      ),
    },
    {
      path: "/admin/add-task",
      element: (
        <Suspense fallback={<Loader />}>
          <TaskForm method={"add"} />
        </Suspense>
      ),
    },
    {
      path: "/admin/task/:taskName",
      element: (
        <Suspense fallback={<Loader />}>
          <TaskDashboard />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Loader />}>
          <NotFound />
        </Suspense>
      ),
    },

    // Messages Route
    {
      path: "/admin/messages",
      element: (
        <Suspense fallback={<Loader />}>
          <MessagesDashboard />
        </Suspense>
      ),
    },
  ],
};
