import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/ui/loader/Loader";

// Lazy load admin pages
const AdminDashboard = lazy(
  () => import("@/components/adminDashboard/AdminDashboard")
);
const MembersDashboard = lazy(
  () => import("@/pages/membersDashboard/MembersDashboard")
);
const ActivitiesDashboard = lazy(
  () => import("@/pages/activitiesDashboard/ActivitiesDashboard")
);
const ActivityForm = lazy(
  () => import("@/components/forms/activityForm/ActivityForm")
);
const TasksDashBoard = lazy(
  () => import("@/pages/tasksDashboard/TasksDashboard")
);
const TaskDashboard = lazy(() => import("@/pages/taskDashboard/TaskDashboard"));
const TaskForm = lazy(() => import("@/components/forms/taskForm/TaskForm"));
const MessagesDashboard = lazy(
  () => import("@/pages/messagesDashboard/MessagesDashboard")
);

// Lazy load error pages
const NotFound = lazy(() => import("@/pages/errorPages/NotFound"));

// Contexts
import MessagesProvider from "@/contexts/MessagesContext";
import { MembersProvider } from "@/contexts/MembersProvider";
import { ActivitiesProvider } from "@/contexts/ActivitiesContext";
import { TasksProvider } from "@/contexts/TasksContext";

// Layouts
import AdminLayout from "@/layouts/AdminLayout";

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
  ],
};
