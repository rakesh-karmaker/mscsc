import type { ReactNode } from "react";
import Loader from "../ui/loader/loader";

import "./list-layout.css";

export default function ListLayout({
  title,
  children,
  isLoading = false,
}: {
  title: string;
  children: ReactNode;
  isLoading: boolean;
}): ReactNode {
  return (
    <div className="lists w-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-lg">
      <p className="list-title">{title}</p>
      {isLoading ? (
        <div className="w-full h-48 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <ul>{children}</ul>
      )}
    </div>
  );
}
