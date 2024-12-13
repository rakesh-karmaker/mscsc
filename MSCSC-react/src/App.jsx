import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Executives from "./pages/Executives";
import "./App.css";

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
      {/* <h1>Hello</h1> */}
    </>
  );
}

export default App;
