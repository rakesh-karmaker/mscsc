import { lazy, Suspense } from "react";
import Loader from "@/components/ui/loader/loader";

// Lazy load pages
const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const MembersPage = lazy(() => import("@/pages/members/members"));
const ActivitiesPage = lazy(() => import("@/pages/activities"));
const ActivityPage = lazy(() => import("@/pages/activity/activity"));
const ContactPage = lazy(() => import("@/pages/contact"));
const Executives = lazy(() => import("@/pages/executives/executives"));
const ProfilePage = lazy(() => import("@/pages/profile/profile.js"));
const TasksPage = lazy(() => import("@/pages/tasks"));
const TaskPage = lazy(() => import("@/pages/task/task"));
const TermsOfService = lazy(
  () => import("@/pages/legal-pages/terms-of-service")
);
const PrivacyPolicy = lazy(() => import("@/pages/legal-pages/privacy-policy"));

// Lazy load error pages
const NotFound = lazy(() => import("@/pages/error-pages/not-found"));

// Contexts
import { ActivitiesProvider } from "@/contexts/activities-context";
import { MembersProvider } from "@/contexts/members-context";
import { TasksProvider } from "@/contexts/tasks-context";

// Layouts
import UserLayout from "@/layouts/user-layout";

export const publicRoutes = {
  path: "/",
  element: <UserLayout />,
  children: [
    // Home Route
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

    // About Route
    {
      path: "/about",
      element: (
        <Suspense fallback={<Loader />}>
          <About />
        </Suspense>
      ),
    },

    // Members Route
    {
      path: "/members",
      element: (
        <Suspense fallback={<Loader />}>
          <MembersProvider>
            <MembersPage />
          </MembersProvider>
        </Suspense>
      ),
    },
    {
      path: "/member/:username",
      element: (
        <Suspense fallback={<Loader />}>
          <ProfilePage />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Loader />}>
          <NotFound />
        </Suspense>
      ),
    },

    // Activities Route
    {
      path: "/activities",
      element: (
        <Suspense fallback={<Loader />}>
          <ActivitiesProvider>
            <ActivitiesPage />
          </ActivitiesProvider>
        </Suspense>
      ),
    },
    {
      path: "/activity/:activityName",
      element: (
        <Suspense fallback={<Loader />}>
          <ActivityPage />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Loader />}>
          <NotFound />
        </Suspense>
      ),
    },

    // Contact Route
    {
      path: "/contact",
      element: (
        <Suspense fallback={<Loader />}>
          <ContactPage />
        </Suspense>
      ),
    },

    // Executives Route
    {
      path: "/executives",
      element: (
        <Suspense fallback={<Loader />}>
          <Executives />
        </Suspense>
      ),
    },

    // Tasks Route
    {
      path: "/tasks",
      element: (
        <Suspense fallback={<Loader />}>
          <TasksProvider>
            <TasksPage />
          </TasksProvider>
        </Suspense>
      ),
    },
    {
      path: "/task/:taskName",
      element: (
        <Suspense fallback={<Loader />}>
          <TaskPage />
        </Suspense>
      ),
      errorElement: (
        <Suspense fallback={<Loader />}>
          <NotFound />
        </Suspense>
      ),
    },

    // Legal Routes
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
  ],
};
