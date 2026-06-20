import { useState, type ReactNode } from "react";
import { Popover } from "@mui/material";
import BsInfoCircleFill from "~icons/bi/info-circle-fill";
import BsInfoCircle from "~icons/bi/info-circle";
import LuX from "~icons/lucide/x";

export default function FormLayout({
  title,
  description,
  children,
  textSize = "xl",
  fontWeight = "medium",
  cancelButton,
  dragger,
  id,
}: {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  textSize?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  cancelButton?: ReactNode;
  dragger?: ReactNode;
  id: string;
}): ReactNode {
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const tooltipId = `tooltip-${id || Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex w-full items-center gap-2 max-sm:flex-col max-sm:items-start">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-2">
            {dragger ? <>{dragger}</> : null}
            <h2 className={`font-${fontWeight} text-${textSize}`}>{title}</h2>
          </div>
          <div className="w-fit h-fit relative">
            <button
              onClick={() => setIsTooltipOpen(!isTooltipOpen)}
              className="text-base rounded-full flex items-center justify-center text-highlighted-color hover:text-black transition cursor-pointer mt-1!"
              type="button"
              id={tooltipId}
            >
              {isTooltipOpen ? <BsInfoCircleFill /> : <BsInfoCircle />}
            </button>
            <Popover
              id={id}
              open={isTooltipOpen}
              anchorEl={document.getElementById(tooltipId)}
              onClose={() => setIsTooltipOpen(false)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                style: {
                  boxShadow: "rgba(149, 157, 165, 0.1) 0px 8px 24px",
                  marginTop: "4px",
                },
              }}
            >
              <div className="w-full h-full flex flex-col bg-primary-bg rounded-md border border-gray-300 p-4!">
                <div className="w-full h-full flex flex-col gap-2 max-w-xs">
                  <div className="w-full h-full flex items-center justify-between gap-10 pb-3! border-b border-gray-300">
                    <h3 className="text-lg font-semibold">Info</h3>
                    <button
                      className="w-fit bg-secondary-bg text-red-500 p-1! rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400/30 transition"
                      onClick={() => setIsTooltipOpen(false)}
                      type="button"
                    >
                      <LuX />
                    </button>
                  </div>
                  {description}
                </div>
              </div>
            </Popover>
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
