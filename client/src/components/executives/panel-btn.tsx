import type { ReactNode } from "react";

export default function PanelBtn({
  active,
  panelYear,
  onClick,
}: {
  active: boolean;
  panelYear: string;
  onClick: () => void;
}): ReactNode {
  return (
    <button
      className={`panel-year ${active && "active-year"}`}
      data-year={panelYear}
      onClick={onClick}
      type="button"
      aria-label={`Toggle executives panel of year ${panelYear}`}
    >
      {panelYear}
    </button>
  );
}
