import { lazy, Suspense } from "react";
import "@/global.css";
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
const TermsOfService = lazy(() => import("@/pages/terms/Terms"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy/PrivacyPolicy"));

// Lazy load error pages
const NotFound = lazy(() => import("@/pages/Errors/NotFound"));

// Layouts
import UserLayout from "@/layouts/UserLayout";

export const publicRoutes = {
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
};
