import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/global.css";
import App from "@/App.jsx";
import ProtectedRoute from "@/components/ProtectedRoute";

// pages
import Home from "@/pages/home/Home.jsx";
import About from "@/pages/about/About.jsx";
import MemberPage from "@/pages/members/Members";
import Activities from "@/pages/activities/Activities.jsx";
import Activity from "@/pages/activity/Activity";
import ContactPage from "@/pages/contact/Contact.jsx";
import Executives from "@/pages/executives/Executives.jsx";
import Profile from "@/pages/profile/Profile.jsx";
import Auth from "@/pages/auth/Auth";
import ResetPassword from "@/pages/resetPassword/ForgotPassword";
import TermsOfService from "@/pages/terms/Terms";
import PrivacyPolicy from "@/pages/privacy/PrivacyPolicy";

//admin pages
import AdminDashboard from "@/components/admin/adminDashboard/AdminDashboard";
import MembersDashboard from "@/components/admin/membersDashboard/MembersDashboard";
import ActivitiesDashboard from "@/components/admin/activitiesDashboard/ActivitiesDashboard";
import MessagesDashboard from "@/components/admin/messagesDashboard/MessagesDashboard";

//error pages
import NotFound from "@/pages/Errors/NotFound";
import ServerError from "@/pages/Errors/ServerError";
import BadRequest from "@/pages/Errors/BadRequest";
import Unauthorized from "@/pages/Errors/Unauthorized";

//contexts
import { UserProvider } from "@/contexts/UserContext.jsx";
import { MemberProvider } from "@/contexts/MembersContext";
import { MessagesProvider } from "@/components/admin/contexts/MessagesContext";
import { ActivitiesProvider } from "@/contexts/ActivitiesContext";

//layouts
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";

const queryClient = new QueryClient();

// router configuration for navigating between pages
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ActivitiesProvider>
        <MemberProvider>
          <App />
        </MemberProvider>
      </ActivitiesProvider>
    ),
    children: [
      {
        path: "/",
        element: <UserLayout />,
        children: [
          { path: "/", element: <Home /> },

          { path: "/home", element: <Home /> },

          { path: "/about", element: <About /> },

          { path: "/activities", element: <Activities /> },

          {
            path: "/activity/:activityName",
            element: <Activity />,
            errorElement: <NotFound />,
          },

          { path: "/executives", element: <Executives /> },

          { path: "/contact", element: <ContactPage /> },

          { path: "/register", element: <Auth method="Register" /> },

          { path: "/login", element: <Auth method="Login" /> },

          { path: "/forgot-password", element: <ResetPassword /> },

          { path: "/members", element: <MemberPage /> },

          { path: "/privacy-policy", element: <PrivacyPolicy /> },

          { path: "/terms-of-service", element: <TermsOfService /> },

          {
            path: "/member/:username",
            element: <Profile />,
            errorElement: <NotFound />,
          },
        ],
      },
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

          { path: "/admin/dashboard", element: <AdminDashboard /> },

          { path: "/admin/members", element: <MembersDashboard /> },

          { path: "/admin/activities", element: <ActivitiesDashboard /> },

          { path: "/admin/messages", element: <MessagesDashboard /> },
        ],
      },
    ],
  },
  { path: "400", element: <BadRequest /> },

  { path: "401", element: <Unauthorized /> },

  { path: "500", element: <ServerError /> },

  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
