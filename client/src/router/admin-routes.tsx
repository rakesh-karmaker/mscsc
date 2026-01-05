import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/protected-route";
import Loader from "@/components/ui/loader/loader";

// Lazy load admin pages
const AdminDashboard = lazy(
  () => import("@/components/admin-dashboard/admin-dashboard")
);
const MembersDashboard = lazy(
  () => import("@/pages/members-dashboard/members-dashboard")
);
const ActivitiesDashboard = lazy(
  () => import("@/pages/activities-dashboard/activities-dashboard")
);
const ActivityForm = lazy(
  () => import("@/components/forms/activity-form/activity-form")
);
const TasksDashBoard = lazy(() => import("@/pages/tasks-dashboard"));
const TaskDashboard = lazy(
  () => import("@/pages/task-dashboard/task-dashboard")
);
const TaskForm = lazy(() => import("@/components/forms/task-form/task-form"));
const MessagesDashboard = lazy(
  () => import("@/pages/messages-dashboard/messages-dashboard")
);
const AddEvent = lazy(() => import("@/pages/add-event"));

// Lazy load error pages
const NotFound = lazy(() => import("@/pages/error-pages/not-found"));

// Contexts
import MessagesProvider from "@/contexts/messages-context";
import { MembersProvider } from "@/contexts/members-context";
import { ActivitiesProvider } from "@/contexts/activities-context";
import { TasksProvider } from "@/contexts/tasks-context";

// Layouts
import AdminLayout from "@/layouts/admin-layout";

export const adminRoutes = {
  path: "/admin",
  element: (
    <ProtectedRoute>
      <MembersProvider>
        <MessagesProvider>
          <AdminLayout />
        </MessagesProvider>
      </MembersProvider>
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
          <TasksProvider>
            <TasksDashBoard />
          </TasksProvider>
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

    // Events Routes
    {
      path: "/admin/add-event",
      element: (
        <Suspense fallback={<Loader />}>
          <AddEvent />
        </Suspense>
      ),
    },
  ],
};
