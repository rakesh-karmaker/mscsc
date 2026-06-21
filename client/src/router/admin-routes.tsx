import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/protected-route";
import Loader from "@/components/ui/loader/loader";

// Lazy load admin pages
const AdminDashboard = lazy(
  () => import("@/components/admin-dashboard/admin-dashboard"),
);
const MembersDashboard = lazy(() => import("@/pages/members-dashboard"));
const ActivitiesDashboard = lazy(
  () => import("@/pages/activities-dashboard/activities-dashboard"),
);
const ActivityForm = lazy(
  () => import("@/components/forms/activity-form/activity-form"),
);
const TasksDashBoard = lazy(() => import("@/pages/tasks-dashboard"));
const TaskDashboard = lazy(
  () => import("@/pages/task-dashboard/task-dashboard"),
);
const TaskForm = lazy(() => import("@/components/forms/task-form/task-form"));
const MessagesDashboard = lazy(() => import("@/pages/messages-dashboard"));
const AddEvent = lazy(() => import("@/pages/add-event"));
const EditEvent = lazy(() => import("@/pages/edit-event"));
const EventDashboard = lazy(() => import("@/pages/event-dashboard"));

// Lazy load error pages
const NotFound = lazy(() => import("@/pages/error-pages/not-found"));

// Contexts
import { ActivitiesProvider } from "@/contexts/activities-context";
import { TasksProvider } from "@/contexts/tasks-context";

// Layouts
import AdminLayout from "@/layouts/admin-layout";
import { ROLES } from "@/utils/require-minimum-role";

export const adminRoutes = {
  path: "/admin",
  element: (
    <ProtectedRoute requiredRole={ROLES.EXECUTIVE}>
      <AdminLayout />
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
        <ProtectedRoute requiredRole={ROLES.OBSERVER}>
          <Suspense fallback={<Loader />}>
            <MembersDashboard />
          </Suspense>
        </ProtectedRoute>
      ),
    },

    // Activities Routes
    {
      path: "/admin/activities",
      element: (
        <ProtectedRoute requiredRole={ROLES.EXECUTIVE}>
          <Suspense fallback={<Loader />}>
            <ActivitiesProvider>
              <ActivitiesDashboard />
            </ActivitiesProvider>
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/add-activity",
      element: (
        <ProtectedRoute requiredRole={ROLES.EDITOR}>
          <Suspense fallback={<Loader />}>
            <ActivityForm method={"add"} />
          </Suspense>
        </ProtectedRoute>
      ),
    },

    // Tasks Routes
    {
      path: "/admin/tasks",
      element: (
        <ProtectedRoute requiredRole={ROLES.EXECUTIVE}>
          <Suspense fallback={<Loader />}>
            <TasksProvider>
              <TasksDashBoard />
            </TasksProvider>
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/add-task",
      element: (
        <ProtectedRoute requiredRole={ROLES.EDITOR}>
          <Suspense fallback={<Loader />}>
            <TaskForm method={"add"} />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/task/:taskName",
      element: (
        <ProtectedRoute requiredRole={ROLES.EXECUTIVE}>
          <Suspense fallback={<Loader />}>
            <TaskDashboard />
          </Suspense>
        </ProtectedRoute>
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
        <ProtectedRoute requiredRole={ROLES.OBSERVER}>
          <Suspense fallback={<Loader />}>
            <MessagesDashboard />
          </Suspense>
        </ProtectedRoute>
      ),
    },

    // Events Routes
    {
      path: "/admin/add-event",
      element: (
        <ProtectedRoute requiredRole={ROLES.EDITOR}>
          <Suspense fallback={<Loader />}>
            <AddEvent />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/event/:eventSlug",
      element: (
        <ProtectedRoute requiredRole={ROLES.OBSERVER}>
          <Suspense fallback={<Loader />}>
            <EventDashboard />
          </Suspense>
        </ProtectedRoute>
      ),
      errorElement: (
        <Suspense fallback={<Loader />}>
          <NotFound />
        </Suspense>
      ),
    },
    {
      path: "/admin/edit-event/:eventSlug",
      element: (
        <ProtectedRoute requiredRole={ROLES.EDITOR}>
          <Suspense fallback={<Loader />}>
            <EditEvent />
          </Suspense>
        </ProtectedRoute>
      ),
      errorElement: (
        <Suspense fallback={<Loader />}>
          <NotFound />
        </Suspense>
      ),
    },
  ],
};
