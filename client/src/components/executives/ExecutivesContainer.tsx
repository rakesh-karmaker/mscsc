import { useState, useEffect, type ReactNode } from "react";
import type { ExecutivesData } from "@/types/executiveTypes";
import PanelBtn from "./PanelBtn";
import { PanelsDropdown, panelsDropdownClick } from "./PanelsDropdown";
import ExecutiveCard from "../ui/executiveCard/ExecutiveCard";

export default function ExecutivesContainer({
  executivesData,
}: {
  executivesData: ExecutivesData;
}): ReactNode {
  // get all the panels
  const panels = Object.keys(executivesData);

  // Make a state for the executives panel to be rendered and re-rendered when a year panel is clicked
  const [currentPanel, setCurrentPanel] = useState<string>(panels[0]);

  // Filter executives by current year
  const selectedExecutives = executivesData[currentPanel];

  // Change the executives panel when a year panel is clicked
  const handlePanelClick = (panel: string) => {
    setCurrentPanel(panel);

    if (window.innerWidth <= 950) {
      const executivePanels = document.querySelectorAll(".panel-year");
      executivePanels.forEach((ep) => {
        const executivePanel = ep as HTMLElement;
        executivePanel.getAttribute("data-year") === panel
          ? (executivePanel.style.order = "-1")
          : (executivePanel.style.order = "0");
      });
    }

    panelsDropdownClick(panels);
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
              panelsDropdownClick(panels);
            }}
          />
        )}
        {panels.map((panel) => (
          <PanelBtn
            active={panel === currentPanel}
            panelYear={panel}
            onClick={() => {
              handlePanelClick(panel);
            }}
            key={panel}
          />
        ))}
      </aside>

      <div className="executives-container">
        {selectedExecutives.map((executive) => {
          return (
            <ExecutiveCard
              executiveData={executive}
              panel={currentPanel}
              key={executive.name}
            />
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
