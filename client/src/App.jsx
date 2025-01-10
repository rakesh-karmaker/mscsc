import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <HelmetProvider>
        <Outlet />
      </HelmetProvider>
    </>
  );
}

export default App;
