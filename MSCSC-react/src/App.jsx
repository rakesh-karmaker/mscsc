import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Executives from "./pages/Executives";
import About from "./pages/About";
import ContactPage from "./pages/Contact";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
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
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
