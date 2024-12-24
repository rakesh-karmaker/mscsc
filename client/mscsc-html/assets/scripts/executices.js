import { executivesData } from "./data.js";

// This callback function is called when the user will press something on the page or the nav-links and
// will close the navbar
if (window.innerWidth <= 800) {
  $("main, footer, .nav-link a").click(() => {
    $(".nav-links-container").slideUp("fast");
  });
}

// This callback function is called when the user will press the hamburger button and
// will open/close the navbar
$(".navbar-toggler").click(() => {
  $(".nav-links-container").slideToggle("fast");
});

const years = Object.keys(executivesData);
let constructedHtml = {};

/**
 * This function uses innerHTML to dynamically create the executive members' elements
 * It is used to reduce the HTML code
 * It is not a good practice to use innerHTML so just use react components
 *
 * @param {Number} year - The year of the executives
 */
const createExecutiveMemberElement = (year) => {
  $(".panel-year").removeClass("active-year");
  $(`.panel-year[year="${year}"]`).addClass("active-year");

  if (!constructedHtml[year]) {
    constructedHtml[year] = "";
    const PanelData = executivesData[year];
    PanelData.forEach((member) => {
      const { name, position, image, socials } = member;

      let memberSocialHTML = "";
      if (socials) {
        Object.keys(socials).forEach((social) => {
          let socialLink = socials[social];
          memberSocialHTML += `
          <a href=${socialLink} target="_blank" title=${social}><i class="row-center fa-brands fa-${social}"></i></a>
        `;
        });
      }

      constructedHtml[year] += `
        <div class="executive-member">
          <div>
            <div class="executive-upper">
              <img
                src="../assets/images/executive-members/${image}"
                alt="A picture of ${name}"
              />
              <div class="member-socials row-center">
                ${memberSocialHTML}
              </div>
            </div>
            <div class="executive-lower col-center">
              <p>${name}</p>
              <p class="secondary-text">${position}</p>
            </div>
          </div>
        </div>
    `;
    });
  }
  const executivesContainer = document.querySelector(".executives-container");
  executivesContainer.innerHTML = constructedHtml[year];
  const executiveMembers = document.querySelectorAll(".executive-member");
  executiveMembers.forEach((executiveMember) => {
    observeExecutiveMember.observe(executiveMember);
  });
  window.scrollTo(0, 0);
};

/**
 * This function uses innerHTML to dynamically create the year-panel elements
 * It is used to reduce the HTML code
 * It is not a good practice to use innerHTML so just use react components
 */
const createYearElement = () => {
  const yearContainer = document.querySelector(
    ".executive-panel-container > aside"
  );
  years.forEach((year) => {
    yearContainer.innerHTML += `
      <button
        class="panel-year"
        year="${year}"
      >
        ${year}
      </button>
    `;
  });

  // This event listener is used to make the triggered year panel move to the top
  $(".panel-year").click((e) => {
    const calledYearPanel = e.target.getAttribute("year");
    if (window.innerWidth <= 950) {
      const yearPanels = document.querySelectorAll(".panel-year");
      yearPanels.forEach((yearPanel) => {
        yearPanel.getAttribute("year") === calledYearPanel
          ? (yearPanel.style.order = "-1")
          : (yearPanel.style.order = "0");
      });
      toggleYearDropdown();
    }
    createExecutiveMemberElement(calledYearPanel);
  });
};

// The toggleYearDropdown function is used to toggle the year dropdown's height
const toggleYearDropdown = () => {
  const yearDropdownButton = document.querySelector(".year-dropdown");
  yearDropdownButton.classList.toggle("active");
  const yearsDropdown = document.querySelector(
    ".executive-panel-container > aside"
  );
  if (yearsDropdown.getAttribute("dropdown-active") === "false") {
    yearsDropdown.style.height = 40 * years.length + "px";
    yearsDropdown.setAttribute("dropdown-active", "true");
  } else {
    yearsDropdown.style.height = "40px";
    yearsDropdown.setAttribute("dropdown-active", "false");
  }
};

// The observeExecutiveMember function is used to observe the executive members and make scale up animation
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

$().ready(() => {
  createYearElement();
  createExecutiveMemberElement(years[0]);
});
