import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import "@/global.css";
import App from "@/App.jsx";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/UI/Loader/Loader";

// Lazy load pages
const Home = lazy(() => import("@/pages/home/Home.jsx"));
const About = lazy(() => import("@/pages/about/About.jsx"));
const MemberPage = lazy(() => import("@/pages/members/Members"));
const Activities = lazy(() => import("@/pages/activities/Activities.jsx"));
const Activity = lazy(() => import("@/pages/activity/Activity"));
const ContactPage = lazy(() => import("@/pages/contact/Contact.jsx"));
const Executives = lazy(() => import("@/pages/executives/Executives.jsx"));
const Profile = lazy(() => import("@/pages/profile/Profile.jsx"));
const Tasks = lazy(() => import("@/pages/tasks/Tasks"));
const Task = lazy(() => import("@/pages/task/Task"));
const Auth = lazy(() => import("@/pages/auth/Auth"));
const ResetPassword = lazy(() =>
  import("@/pages/resetPassword/ForgotPassword")
);
const TermsOfService = lazy(() => import("@/pages/terms/Terms"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy/PrivacyPolicy"));

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
const ServerError = lazy(() => import("@/pages/Errors/ServerError"));
const BadRequest = lazy(() => import("@/pages/Errors/BadRequest"));
const Unauthorized = lazy(() => import("@/pages/Errors/Unauthorized"));

// Contexts
import { MemberProvider } from "@/contexts/MembersContext";
import { MessagesProvider } from "@/components/admin/contexts/MessagesContext";
import { ActivitiesProvider } from "@/contexts/ActivitiesContext";
import { TaskProvider } from "@/contexts/TasksContext";

// Layouts
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";

// Router configuration for navigating between pages
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ActivitiesProvider>
        <MemberProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </MemberProvider>
      </ActivitiesProvider>
    ),
    children: [
      //! Public routes
      {
        path: "/",
        element: <UserLayout />,
        children: [
          {
            path: "/",
            element: (
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            ),
          },
          {
            path: "/home",
            element: (
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            ),
          },
          {
            path: "/about",
            element: (
              <Suspense fallback={<Loader />}>
                <About />
              </Suspense>
            ),
          },
          {
            path: "/activities",
            element: (
              <Suspense fallback={<Loader />}>
                <Activities />
              </Suspense>
            ),
          },
          {
            path: "/activity/:activityName",
            element: (
              <Suspense fallback={<Loader />}>
                <Activity />
              </Suspense>
            ),
            errorElement: (
              <Suspense fallback={<Loader />}>
                <NotFound />
              </Suspense>
            ),
          },
          {
            path: "/executives",
            element: (
              <Suspense fallback={<Loader />}>
                <Executives />
              </Suspense>
            ),
          },
          {
            path: "/contact",
            element: (
              <Suspense fallback={<Loader />}>
                <ContactPage />
              </Suspense>
            ),
          },

          {
            path: "/members",
            element: (
              <Suspense fallback={<Loader />}>
                <MemberPage />
              </Suspense>
            ),
          },
          {
            path: "/tasks",
            element: (
              <Suspense fallback={<Loader />}>
                <Tasks />
              </Suspense>
            ),
          },
          {
            path: "/task/:taskName",
            element: (
              <Suspense fallback={<Loader />}>
                <Task />
              </Suspense>
            ),
            errorElement: (
              <Suspense fallback={<Loader />}>
                <NotFound />
              </Suspense>
            ),
          },
          {
            path: "/privacy-policy",
            element: (
              <Suspense fallback={<Loader />}>
                <PrivacyPolicy />
              </Suspense>
            ),
          },
          {
            path: "/terms-of-service",
            element: (
              <Suspense fallback={<Loader />}>
                <TermsOfService />
              </Suspense>
            ),
          },
          {
            path: "/member/:username",
            element: (
              <Suspense fallback={<Loader />}>
                <Profile />
              </Suspense>
            ),
            errorElement: (
              <Suspense fallback={<Loader />}>
                <NotFound />
              </Suspense>
            ),
          },
        ],
      },

      //! Auth Routes
      {
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
      },

      //! Admin Routes
      {
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
      },
    ],
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
