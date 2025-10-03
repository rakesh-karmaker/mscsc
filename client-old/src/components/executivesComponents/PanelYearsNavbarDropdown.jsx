import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const YearsDropdown = ({ onClick }) => {
  return (
    <button
      className="year-dropdown"
      onClick={onClick}
      aria-label="Toggle years dropdown"
      type="button"
    >
      <FontAwesomeIcon icon="fa-solid fa-angle-down" />
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
