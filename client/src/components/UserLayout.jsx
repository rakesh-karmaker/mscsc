import { Outlet } from "react-router-dom";
import Header from "./nav-bars/Header/Header";
import Footer from "./UI/Footer/Footer";

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
