import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

export default function AdminDashboardHeader({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full flex justify-between gap-3.75 flex-wrap">
      <div className="flex flex-col gap-1.25">
        <h1 className="text-[2.5em] uppercase text-text-primary font-semibold">
          {title}
        </h1>
        <p className="text-[#000000c9]">{children}</p>
      </div>
      {window.innerWidth > 1530 && (
        <NavLink to="/" className="primary-button">
          Home Page
        </NavLink>
      )}
    </div>
  );
}
