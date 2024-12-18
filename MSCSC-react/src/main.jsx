import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Executives from "./pages/Executives";
import About from "./pages/About";
import ContactPage from "./pages/Contact";
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
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
