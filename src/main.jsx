import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Activities from "./Pages/Activities.jsx";
import Executives from "./Pages/Executives.jsx";
import About from "./Pages/About.jsx";
import ContactPage from "./Pages/Contact.jsx";
import Auth from "./Pages/Auth";
import "./global.css";
import App from "./App.jsx";

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
    <RouterProvider router={router} />
  </StrictMode>
);
