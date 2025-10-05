import type { ReactNode } from "react";

export default function TaskSidebarCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="task-sidebar-card">
      <p className="task-sidebar-card-title">{title}</p>
      <div className="task-sidebar-card-content">{children}</div>
    </div>
  );
}
