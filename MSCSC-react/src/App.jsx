import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Executives from "./pages/Executives";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/executives" element={<Executives />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
