import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export default function PrimaryBtn({
  children,
  link,
  name,
  isHeader,
}: {
  children: ReactNode;
  link: string;
  name: string;
  isHeader?: boolean;
}): ReactNode {
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
