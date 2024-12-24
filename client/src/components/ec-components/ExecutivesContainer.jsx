import YearPanel from "@/components/ec-components/PanelYearBtn";
import { useState, useEffect } from "react";
import ExecutiveCard from "@/components/UI/ExecutiveCard/ExecutiveCard";
import {
  YearsDropdown,
  yearsDropdownClick,
} from "@/components/ec-components/PanelYearsNavbarDropdown";
const ExecutivesContainer = ({ years, executivesData }) => {
  // Make a state for the executives panel to be rendered and re-rendered when a year panel is clicked
  const [currentYear, setCurrentYear] = useState(years[0]);

  // Filter executives by current year
  const selectedExecutives = executivesData.filter(
    (executive) => executive.panel === currentYear
  );

  // Change the executives panel when a year panel is clicked
  const handlePanelClick = (year) => {
    setCurrentYear(year);
    if (window.innerWidth <= 950) {
      const yearPanels = document.querySelectorAll(".panel-year");
      yearPanels.forEach((yearPanel) => {
        yearPanel.getAttribute("year") === year
          ? (yearPanel.style.order = "-1")
          : (yearPanel.style.order = "0");
      });
      yearsDropdownClick(years);
    }
    window.scrollTo(0, 0);
  };

  // Observe the executive members
  useEffect(() => {
    document
      .querySelectorAll(".executive-member")
      .forEach((executiveMember) => {
        observeExecutiveMember.observe(executiveMember);
      });
  });

  return (
    <>
      <aside dropdown-active="false">
        {window.innerWidth > 950 ? null : (
          <YearsDropdown
            onClick={() => {
              yearsDropdownClick(years);
            }}
          />
        )}
        {years.map((year) => (
          <YearPanel
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
};

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
    threshold: 0.3,
  }
);

export default ExecutivesContainer;
