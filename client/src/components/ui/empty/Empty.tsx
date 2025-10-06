import type { CSSProperties, ReactNode } from "react";
import { FaRegFaceFrownOpen } from "react-icons/fa6";

import "./empty.css";

export default function Empty({ style }: { style?: CSSProperties }): ReactNode {
  return (
    <div className="empty-data col-center" style={style}>
      <FaRegFaceFrownOpen />
      <p>
        No <span className="highlighted-text">results</span> found
      </p>
    </div>
  );
}
