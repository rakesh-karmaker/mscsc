import { cn } from "@/utils/cn";
import type { ReactNode } from "react";
import { LuSearch } from "react-icons/lu";

export default function ColumnInput({
  className,
  ...props
}: React.ComponentProps<"input">): ReactNode {
  return (
    <div className="flex w-fit h-10 items-center gap-2 border-b border-black/20 px-3!">
      <LuSearch className="size-4 shrink-0 opacity-50" />
      <input
        className={cn(
          "flex h-15 rounded-md bg-transparent py-3! text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function ColumnLists({
  className,
  ...props
}: React.ComponentProps<"div">): ReactNode {
  return (
    <div
      data-slot="command-list"
      className={cn(
        "max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden",
        className,
      )}
      {...props}
    >
      {props.children}
    </div>
  );
}

export function EmptyResults({
  ...props
}: React.ComponentProps<"p">): ReactNode {
  return (
    <p className="py-6 text-center text-sm" {...props}>
      No columns found
    </p>
  );
}
