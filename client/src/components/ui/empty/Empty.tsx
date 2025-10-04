import type { ReactNode } from "react";
import { FaRegFaceFrownOpen } from "react-icons/fa6";

import "./empty.css";

export default function Empty(): ReactNode {
  return (
    <div className="empty-data col-center">
      <FaRegFaceFrownOpen />
      <p>
        No <span className="highlighted-text">results</span> found
      </p>
    </div>
  );
}
