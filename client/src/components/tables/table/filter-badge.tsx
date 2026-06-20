import { cn } from "@/utils/cn";

export default function FilterBadge({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex bg-secondary-bg/40 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
