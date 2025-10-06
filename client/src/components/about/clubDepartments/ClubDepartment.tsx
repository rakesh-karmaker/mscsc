import type { ReactNode } from "react";

export default function ClubDepartment({
  children,
  dptName,
}: {
  children: ReactNode;
  dptName: string;
}): ReactNode {
  return (
    <li className="dpt col-center">
      <div className="icon">{children}</div>
      <p className="dpt-name">{dptName}</p>
    </li>
  );
}
