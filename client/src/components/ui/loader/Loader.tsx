import type React from "react";
import "./loader.css";

export default function Loader(): React.ReactNode {
  return (
    <div className="loader col-center">
      <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
      <p>Loading...</p>
    </div>
  );
}
