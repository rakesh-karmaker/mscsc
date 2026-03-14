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
      <div className="flex flex-col">
        <h1 className="text-[2.25em] uppercase text-text-primary font-semibold">
          {title}
        </h1>
        <p className="text-[#000000c9]">{children}</p>
      </div>
      {window.innerWidth > 1530 && (
        <NavLink to="/" className="primary-button px-5! py-1.5! text-[1.1rem]!">
          Home Page
        </NavLink>
      )}
    </div>
  );
}
