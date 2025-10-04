import Navbar from "./navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import type { ReactNode } from "react";

export default function UserLayout(): ReactNode {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
