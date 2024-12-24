import { Outlet } from "react-router-dom";
import Header from "./components/nav-bars/Header";
import Footer from "./components/Footer";
import { useEffect, useRef } from "react";

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
