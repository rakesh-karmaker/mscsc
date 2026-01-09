import {
  Activity,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import Tooltip from "./tooltip";
import { BsInfoCircleFill, BsInfoCircle } from "react-icons/bs";

export default function FormLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
}): ReactNode {
  const [showOnRight, setShowOnRight] = useState<boolean>(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isTooltipVisible && btnRef.current && tooltipRef.current) {
      const btnRect = btnRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipRight = btnRect.right - tooltipWidth;
      if (tooltipRight > 0) {
        setShowOnRight(true);
      } else {
        setShowOnRight(false);
      }
    }
  }, [isTooltipVisible]);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="w-fit h-fit relative">
          <button
            ref={btnRef}
            onClick={() => setIsTooltipVisible(!isTooltipVisible)}
            className="text-xl rounded-full flex items-center justify-center text-highlighted-color hover:text-black transition cursor-pointer mt-1!"
            type="button"
          >
            {isTooltipVisible ? <BsInfoCircleFill /> : <BsInfoCircle />}
          </button>
          <Activity mode={isTooltipVisible ? "visible" : "hidden"}>
            <Tooltip
              showOnRight={showOnRight}
              tooltipRef={tooltipRef as RefObject<HTMLDivElement>}
              description={description}
              setIsTooltipVisible={setIsTooltipVisible}
            />
          </Activity>
        </div>
      </div>
      {children}
    </div>
  );
}
