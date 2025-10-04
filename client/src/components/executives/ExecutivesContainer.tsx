import { useState, useEffect, type ReactNode } from "react";
import type { Executive } from "@/types/executiveTypes";
import PanelBtn from "./PanelBtn";
import { PanelsDropdown, panelsDropdownClick } from "./PanelsDropdown";
import ExecutiveCard from "../ui/executiveCard/ExecutiveCard";

export default function ExecutivesContainer({
  years,
  executivesData,
}: {
  years: string[];
  executivesData: Executive[];
}): ReactNode {
  // Make a state for the executives panel to be rendered and re-rendered when a year panel is clicked
  const [currentYear, setCurrentYear] = useState(years[0]);

  // Filter executives by current year
  const selectedExecutives = executivesData.filter(
    (executive) => executive.panel === currentYear
  );

  // Change the executives panel when a year panel is clicked
  const handlePanelClick = (year: string) => {
    setCurrentYear(year);
    if (window.innerWidth <= 950) {
      const yearPanels = document.querySelectorAll(".panel-year");
      yearPanels.forEach((yearPanel) => {
        const panel = yearPanel as HTMLElement;
        panel.getAttribute("data-year") === year
          ? (panel.style.order = "-1")
          : (panel.style.order = "0");
      });
    }
    panelsDropdownClick(years);
    window.scrollTo(0, 0);
  };

  // Observe the executive members
  useEffect(() => {
    document
      .querySelectorAll(".executive-member")
      .forEach((executiveMember) => {
        observeExecutiveMember.observe(executiveMember);
      });
  }, [selectedExecutives]);

  return (
    <>
      <aside dropdown-active="false">
        {window.innerWidth > 980 ? null : (
          <PanelsDropdown
            onClick={() => {
              panelsDropdownClick(years);
            }}
          />
        )}
        {years.map((year) => (
          <PanelBtn
            active={year === currentYear}
            panelYear={year}
            onClick={() => {
              handlePanelClick(year);
            }}
            key={year}
          />
        ))}
      </aside>

      <div className="executives-container">
        {selectedExecutives.map((executive) => {
          return (
            <ExecutiveCard executiveData={executive} key={executive.name} />
          );
        })}
      </div>
    </>
  );
}

const observeExecutiveMember = new IntersectionObserver(
  (executiveMembers) => {
    executiveMembers.forEach((executiveMember) => {
      if (executiveMember.isIntersecting) {
        executiveMember.target.classList.add("shown");
        observeExecutiveMember.unobserve(executiveMember.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);
