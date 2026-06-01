import {
  Activity,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import Tooltip from "./tooltip";
import BsInfoCircleFill from "~icons/bi/info-circle-fill";
import BsInfoCircle from "~icons/bi/info-circle";
import { styled } from "@mui/material";

export default function FormLayout({
  title,
  description,
  children,
  textSize = "xl",
  fontWeight = "medium",
  cancelButton,
  dragger,
}: {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  textSize?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  cancelButton?: ReactNode;
  dragger?: ReactNode;
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
      <div className="flex w-full items-center gap-2 max-sm:flex-col max-sm:items-start">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {dragger ? <>{dragger}</> : null}
            <h2 className={`font-${fontWeight} text-${textSize}`}>{title}</h2>
          </div>
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
        {cancelButton && (
          <div className="ml-auto! max-sm:ml-0!">{cancelButton}</div>
        )}
      </div>
      {children}
    </div>
  );
}

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
