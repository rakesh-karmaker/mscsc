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

// Layouts
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";

export const adminRoutes = {
  path: "/admin",
  element: (
    <ProtectedRoute>
      <MessagesProvider>
        <AdminLayout />
      </MessagesProvider>
    </ProtectedRoute>
  ),
  children: [
    { path: "/admin", element: <Navigate to="/admin/dashboard" /> },
    {
      path: "/admin/dashboard",
      element: (
        <Suspense fallback={<Loader />}>
          <AdminDashboard />
        </Suspense>
      ),
    },
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
    {
      path: "/admin/activities",
      element: (
        <Suspense fallback={<Loader />}>
          <ActivitiesDashboard />
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
    {
      path: "/admin/tasks",
      element: (
        <Suspense fallback={<Loader />}>
          <TasksDashBoard />
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
