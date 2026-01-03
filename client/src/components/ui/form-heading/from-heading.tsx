import type { CSSProperties, ReactNode } from "react";

import "./form-heading.css";

export default function FormHeading({
  children,
  ...rest
}: {
  children: ReactNode;
  style?: CSSProperties;
}): ReactNode {
  return (
    <h2 className="form-heading" style={rest?.style}>
      {children}
    </h2>
  );
}
