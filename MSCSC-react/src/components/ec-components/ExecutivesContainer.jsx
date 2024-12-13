import YearPanel from "./PanelYearBtn";
import { useState, useEffect } from "react";
import ExecutiveCard from "./ExecutiveCard";
import {
  YearDropdown,
  yearsDropdownClick,
  orderPanelYears,
} from "./PanelYearsNavbarDropdown";
const ExecutivesContainer = ({ years, executivesData }) => {
  // Filter executives by current year
  let selectedExecutives = executivesData.filter(
    (executive) => executive.panel === years[0]
  );

  // Make a state for the executives panel to be rendered and re-rendered when a year panel is clicked
  const [executivePanel, setExecutivePanel] = useState(
    <ExecutivesPanel data={selectedExecutives} />
  );

  // Change the executives panel when a year panel is clicked
  const handlePanelClick = (year) => {
    selectedExecutives = executivesData.filter(
      (executive) => executive.panel === year
    );
    setExecutivePanel(<ExecutivesPanel data={selectedExecutives} />);
    if (window.innerWidth <= 950) {
      orderPanelYears(year);
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
        <YearDropdown
          onClick={() => {
            yearsDropdownClick(years);
          }}
        />
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

      <div className="executives-container">{executivePanel}</div>
    </>
  );
};

const ExecutivesPanel = (prams) => {
  return (
    <>
      {prams.data.map((executive) => {
        return <ExecutiveCard executiveData={executive} key={executive.name} />;
      })}
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
