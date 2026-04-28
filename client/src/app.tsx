import { Toaster } from "react-hot-toast";
import { ScrollRestoration, Outlet } from "react-router";

export default function App() {
  return (
    <div className="w-full h-full">
      <Outlet />
      <Toaster position="top-right" reverseOrder={false} />
      <ScrollRestoration />
    </div>
  );
}
