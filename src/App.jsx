import { Outlet } from "react-router-dom";
import Header from "./components/nav-bars/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      {/* <Header /> */}
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
