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
import { styled } from "@mui/material";

export default function FormLayout({
  title,
  description,
  children,
  textSize = "xl",
  fontWeight = "medium",
  cancelButton,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
  textSize?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  cancelButton?: ReactNode;
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
      <div className="flex w-full items-center gap-2">
        <h2 className={`font-${fontWeight} text-${textSize}`}>{title}</h2>
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
        {cancelButton && <div className="ml-auto!">{cancelButton}</div>}
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
