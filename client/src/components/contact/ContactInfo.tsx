import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function ContactInfo({
  children,
  title,
  href,
  content,
}: {
  children: ReactNode;
  title: string;
  href: string;
  content: string;
}): ReactNode {
  return (
    <div className="contact">
      <div className="icon row-center">
        <p>{children}</p>
      </div>
      <div className="info">
        <p className="method-name">{title}</p>
        <Link to={href} title={title} className="content">
          {content}
        </Link>
      </div>
    </div>
  );
}
