import { Link } from "react-router-dom";
import type React from "react";

export default function PrimaryBtn({
  children,
  link,
  name,
  isHeader,
}: {
  children: React.ReactNode;
  link: string;
  name: string;
  isHeader?: boolean;
}): React.ReactNode {
  isHeader = isHeader ?? false;

  return (
    <Link
      to={link}
      className={`primary-button ${isHeader ? "header-btn" : ""}`}
      aria-label={`Go to ${name}`}
    >
      {children}
    </Link>
  );
}
