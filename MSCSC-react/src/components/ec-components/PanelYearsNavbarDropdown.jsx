export const YearDropdown = ({ onClick }) => {
  if (window.innerWidth > 950) return null;

  return (
    <button className="year-dropdown" onClick={onClick}>
      <i className="fa-solid fa-angle-down"></i>
    </button>
  );
};

export const yearsDropdownClick = (years) => {
  const yearsDropdownButton = document.querySelector(".year-dropdown");
  const yearsDropdown = document.querySelector(
    ".executive-panel-container > aside"
  );

  yearsDropdownButton.classList.toggle("active");
  yearsDropdown.style.height = yearsDropdownButton.classList.contains("active")
    ? `${40 * years.length}px`
    : "40px";
  yearsDropdown.setAttribute(
    "dropdown-active",
    yearsDropdownButton.classList.contains("active")
  );
};

export const orderPanelYears = (year) => {
  const yearPanels = document.querySelectorAll(".panel-year");
  yearPanels.forEach((yearPanel) => {
    yearPanel.getAttribute("year") === year
      ? (yearPanel.style.order = "-1")
      : (yearPanel.style.order = "0");
  });
  yearsDropdownClick();
};
