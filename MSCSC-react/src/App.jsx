import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Executives from "./pages/Executives";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { path: "/", element: <Home /> },

        { path: "/home", element: <Home /> },

        { path: "/activities", element: <Activities /> },

        { path: "/executives", element: <Executives /> },
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
