import { Tooltip } from "@mui/material";
import RxCross2 from "~icons/radix-icons/cross-2";
import FaPlus from "~icons/fa6-solid/plus";
import { cn } from "@/utils/cn";

export function AddSocialLinkButton({ append }: { append: () => void }) {
  return (
    <Tooltip title="Add social link" arrow placement="top">
      <button
        className={`min-w-10 min-h-10 max-h-10 max-w-10 flex items-center justify-center bg-secondary-bg text-teal rounded-full text-xl hover:bg-highlighted-color hover:text-white transition-all duration-200 cursor-pointer`}
        onClick={() => append()}
        type="button"
        aria-label="Add social link"
      >
        <FaPlus />
      </button>
    </Tooltip>
  );
}

export function RemoveSocialLinkButton({
  remove,
  index,
}: {
  remove: (index: number) => void;
  index: number;
}) {
  return (
    <Tooltip title="Remove social link" arrow placement="top">
      <button
        className={`min-w-10 min-h-10 max-h-10 max-w-10 flex items-center justify-center bg-secondary-bg text-red rounded-full text-xl hover:bg-red hover:text-white transition-all duration-200 cursor-pointer`}
        onClick={() => remove(index)}
        type="button"
        aria-label="Remove social link"
      >
        <RxCross2 />
      </button>
    </Tooltip>
  );
}

export function TableBtn({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "w-full h-full flex gap-2 rounded-sm items-center px-2.5! py-1.5! hover:bg-[#f5f5f5] transition-all cursor-pointer",
        className,
      )}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
}
