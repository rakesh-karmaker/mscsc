import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function SectionHeader({
  title,
  description,
  children,
}: SectionHeaderProps): ReactNode {
  return (
    <div className="section-header">
      <div>
        <h2 className="section-heading">{title}</h2>
        <p className="section-sub-heading secondary-text">{description}</p>
      </div>
      {children}
    </div>
  );
}
