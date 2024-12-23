import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Activities from "./pages/Activities.jsx";
import Executives from "./pages/Executives.jsx";
import About from "./pages/About.jsx";
import ContactPage from "./pages/Contact.jsx";
import Auth from "./pages/Auth";
import "./global.css";
import App from "./App.jsx";
import { UserProvider } from "./Contexts/UserContext.jsx";

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
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
