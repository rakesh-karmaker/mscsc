import type React from "react";
import { NavLink } from "react-router-dom";

import "./errorLayout.css";

export function ErrorLayout({
  children,
  heading,
  link,
  linkText,
  style,
}: {
  children: React.ReactNode;
  heading: string;
  link: string;
  linkText: string;
  style?: React.CSSProperties;
}): React.ReactNode {
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
  children: React.ReactNode;
  message: string;
}): React.ReactNode {
  return (
    <div className="error-content">
      <h3 className="error-info">{message}</h3>
      <p className="error-text">{children}</p>
    </div>
  );
}
