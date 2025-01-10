import { Outlet } from "react-router-dom";
import Header from "@/layout/Header/Header";
import Footer from "@/layout/Footer/Footer";

const UserLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;
