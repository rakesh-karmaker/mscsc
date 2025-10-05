import type { ReactNode } from "react";
import { FaAngleDown } from "react-icons/fa6";

export function PanelsDropdown({
  onClick,
}: {
  onClick: () => void;
}): ReactNode {
  return (
    <button
      className="year-dropdown flex justify-center items-center"
      onClick={onClick}
      aria-label="Toggle years dropdown"
      type="button"
    >
      <FaAngleDown className="!mt-0.5 transition-all duration-200" />
    </button>
  );
}

export function panelsDropdownClick(years: string[]): void {
  const yearsDropdownButton = document.querySelector(".year-dropdown");
  const yearsDropdown = document.querySelector(
    ".executive-panel-container > aside"
  ) as HTMLElement;

  if (!yearsDropdownButton || !yearsDropdown) return;

  yearsDropdownButton.classList.toggle("active");
  yearsDropdown.style.height = yearsDropdownButton.classList.contains("active")
    ? `${40 * years.length}px`
    : "40px";
  yearsDropdown.setAttribute(
    "dropdown-active",
    yearsDropdownButton.classList.contains("active").toString()
  );
}
