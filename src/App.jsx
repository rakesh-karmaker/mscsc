import { Outlet } from "react-router-dom";
import Header from "./components/nav-bars/Header";
import Footer from "./components/Footer";

function App() {
  window.scrollTo(0, 0);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
