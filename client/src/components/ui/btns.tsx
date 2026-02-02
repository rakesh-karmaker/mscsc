import { Tooltip } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";

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
