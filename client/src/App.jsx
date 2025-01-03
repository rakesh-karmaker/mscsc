import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/nav-bars/Header/Header";
import Footer from "./components/UI/Footer/Footer";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
