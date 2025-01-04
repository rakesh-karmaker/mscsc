import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/pages/Home.jsx";
import Activities from "@/pages/Activities.jsx";
import Executives from "@/pages/Executives.jsx";
import About from "@/pages/About.jsx";
import ContactPage from "@/pages/Contact.jsx";
import Auth from "@/pages/Auth";
import "@/global.css";
import App from "@/App.jsx";
import { UserProvider } from "@/contexts/UserContext.jsx";
import Profile from "@/pages/Profile.jsx";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MemberProvider } from "@/contexts/MembersContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminDashboard from "@/admin/AdminDashboard/AdminDashboard";
import { MessagesProvider } from "@/admin/contexts/MessagesContext";
import Messages from "@/admin/Messages/Messages";
import AdminPanel from "@/admin/AdminPanel/AdminPanel";
import Admin from "@/pages/Admin";
import Members from "@/admin/Members/Members";
import AdminActivities from "./admin/AdminActivities/AdminActivities";
import { ActivitiesProvider } from "./contexts/ActivitiesContext";
import MemberPage from "@/pages/Member";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },

      { path: "/home", element: <Home /> },

      { path: "/about", element: <About /> },

      { path: "/activities", element: <Activities /> },

      { path: "/executives", element: <Executives /> },

      { path: "/contact", element: <ContactPage /> },

      { path: "/register", element: <Auth /> },

      { path: "/members", element: <MemberPage /> },

      { path: "/member/:id", element: <Profile /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <MessagesProvider>
          <AdminPanel />
        </MessagesProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/members",
        element: <Members />,
      },
      {
        path: "/admin/activities",
        element: <AdminActivities />,
      },
      {
        path: "/admin/messages",
        element: <Messages />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ActivitiesProvider>
        <MemberProvider>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </MemberProvider>
      </ActivitiesProvider>
    </QueryClientProvider>
  </StrictMode>
);
