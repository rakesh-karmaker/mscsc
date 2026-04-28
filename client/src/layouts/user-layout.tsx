import Navbar from "./navbar/navbar";
import { Outlet } from "react-router-dom";
import Footer from "./footer/footer";
import type { ReactNode } from "react";

export default function UserLayout(): ReactNode {
  return (
    <div className="w-full flex flex-col items-center">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
