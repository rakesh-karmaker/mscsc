import {
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import { RxCross1 } from "react-icons/rx";

type TooltipProps = {
  showOnRight: boolean;
  tooltipRef: RefObject<HTMLDivElement>;
  description: ReactNode;
  setIsTooltipVisible: Dispatch<SetStateAction<boolean>>;
};

export default function Tooltip({
  showOnRight,
  tooltipRef,
  description,
  setIsTooltipVisible,
}: TooltipProps): ReactNode {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640); // 640px = Tailwind 'sm'
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <div
      className={
        isMobile
          ? "fixed inset-0 z-9999 flex items-center justify-center bg-black/40"
          : "w-fit bg-secondary-bg/70 backdrop-blur-lg rounded-md flex flex-col gap-2 absolute left-full top-0 z-99 shadow-md p-4!"
      }
      style={
        isMobile
          ? {}
          : {
              right: showOnRight ? "initial" : "130%",
              left: showOnRight ? "130%" : "initial",
            }
      }
    >
      {" "}
      <div
        ref={tooltipRef}
        className={
          isMobile
            ? "bg-white rounded-md flex flex-col gap-2 w-[90vw] max-w-md p-2"
            : " flex flex-col gap-2"
        }
      >
        <div className="w-full h-full flex flex-col gap-2">
          <div className="w-full h-full flex items-center justify-between gap-10 pb-3! border-b border-gray-300">
            <h3 className="text-lg font-semibold">Info</h3>
            <button
              className="w-fit bg-secondary-bg text-red-500 p-1! rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400/30 transition"
              onClick={() => setIsTooltipVisible(false)}
              type="button"
            >
              <RxCross1 />
            </button>
          </div>
          {description}
        </div>
      </div>
    </div>
  );
}
