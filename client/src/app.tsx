import { Toaster } from "react-hot-toast";
import { ScrollRestoration, Outlet } from "react-router";

export default function App() {
  return (
    <div>
      <Outlet />
      <Toaster position="top-right" reverseOrder={false} />
      <ScrollRestoration />
    </div>
  );
}
