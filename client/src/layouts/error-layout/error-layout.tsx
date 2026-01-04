import { NavLink } from "react-router-dom";
import type { CSSProperties, ReactNode } from "react";

import "./error-layout.css";

export function ErrorLayout({
  children,
  heading,
  link,
  linkText,
  style,
}: {
  children: ReactNode;
  heading: string;
  link: string;
  linkText: string;
  style?: CSSProperties;
}): ReactNode {
  return (
    <div className="error-container">
      <h2 className="error-heading" style={style ?? {}}>
        {heading}
      </h2>
      {children}
      <NavLink to={link} className="primary-button error-link">
        {linkText}
      </NavLink>
    </div>
  );
}

export function ErrorContent({
  children,
  message,
}: {
  children: ReactNode;
  message: string;
}): ReactNode {
  return (
    <div className="error-content">
      <h3 className="error-info">{message}</h3>
      <p className="error-text">{children}</p>
    </div>
  );
}
