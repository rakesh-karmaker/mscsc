import { lazy, Suspense } from "react";
import Loader from "@/components/ui/loader/Loader";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
// const MemberPage = lazy(() => import("@/pages/members/Members"));
// const Activities = lazy(() => import("@/pages/activities/Activities.jsx"));
// const Activity = lazy(() => import("@/pages/activity/Activity"));
const ContactPage = lazy(() => import("@/pages/Contact"));
const Executives = lazy(() => import("@/pages/executives/Executives"));
// const Profile = lazy(() => import("@/pages/profile/Profile.jsx"));
// const Tasks = lazy(() => import("@/pages/tasks/Tasks"));
// const Task = lazy(() => import("@/pages/task/Task"));
const TermsOfService = lazy(() => import("@/pages/legalPages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("@/pages/legalPages/PrivacyPolicy"));

// Lazy load error pages
// const NotFound = lazy(() => import("@/pages/errorPages/NotFound"));

// Contexts
// import { ActivitiesProvider } from "@/contexts/ActivitiesContext";
// import { MembersProvider } from "@/contexts/MembersProvider";
// import { TasksProvider } from "@/contexts/TasksContext";

// Layouts
import UserLayout from "@/layouts/UserLayout";

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

    // // Members Route
    // {
    //   path: "/members",
    //   element: (
    //     <Suspense fallback={<Loader />}>
    //       <MembersProvider>
    //         <MemberPage />
    //       </MembersProvider>
    //     </Suspense>
    //   ),
    // },
    // {
    //   path: "/member/:username",
    //   element: (
    //     <Suspense fallback={<Loader />}>
    //       <Profile />
    //     </Suspense>
    //   ),
    //   errorElement: (
    //     <Suspense fallback={<Loader />}>
    //       <NotFound />
    //     </Suspense>
    //   ),
    // },

    // Activities Route
    // {
    //   path: "/activities",
    //   element: (
    //     <Suspense fallback={<Loader />}>
    //       <ActivitiesProvider>
    //         <Activities />
    //       </ActivitiesProvider>
    //     </Suspense>
    //   ),
    // },
    // {
    //   path: "/activity/:activityName",
    //   element: (
    //     <Suspense fallback={<Loader />}>
    //       <Activity />
    //     </Suspense>
    //   ),
    //   errorElement: (
    //     <Suspense fallback={<Loader />}>
    //       <NotFound />
    //     </Suspense>
    //   ),
    // },

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
    // {
    //   path: "/tasks",
    //   element: (
    //     <Suspense fallback={<Loader />}>
    //       <TasksProvider>
    //         <Tasks />
    //       </TasksProvider>
    //     </Suspense>
    //   ),
    // },
    // {
    //   path: "/task/:taskName",
    //   element: (
    //     <Suspense fallback={<Loader />}>
    //       <Task />
    //     </Suspense>
    //   ),
    //   errorElement: (
    //     <Suspense fallback={<Loader />}>
    //       <NotFound />
    //     </Suspense>
    //   ),
    // },

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
