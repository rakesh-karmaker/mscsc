import { activitiesData } from "./data.js";
const tags = ["all", ...new Set(activitiesData.map(({ tag }) => tag))];

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

// The observeActivities function is used to observe the activities and make scale up animation
const observeActivities = new IntersectionObserver(
  (activities) => {
    activities.forEach((activity) => {
      if (activity.isIntersecting) {
        activity.target.classList.add("shown");
        observeActivities.unobserve(activity.target);
      }
    });
  },
  {
    threshold: 0.3,
  }
);

/**
 * The getActivitiesByTag function is used to get the activities by tag for the data.js file
 *
 * @param selectedTag - The tag to filter by
 * @returns {Array<Activity>} - The filtered activities
 */
const getActivitiesByTag = (selectedTag) => {
  return selectedTag === "all"
    ? activitiesData
    : activitiesData.filter(({ tag }) => tag === selectedTag);
};

/**
 * The getUrlTag function is used to get the tag from the URL
 *
 * @returns {string} - The tag
 */
const getUrlTag = () => {
  const url = new URL(window.location.href);
  const tag = url.searchParams.get("tag");
  return tag ?? "all";
};

/**
 * The generateActivityHTML function is used to generate the HTML for the activity
 *
 * @param activity - The activity to generate the HTML for
 * @param showTag - Whether to show the tag or not
 * @returns {string} - The HTML for the activity
 */
const generateActivityHTML = (
  {
    tag,
    activityDate,
    activityImagePath,
    activityTitle,
    activityDesc,
    activityLink,
  },
  showTag
) => {
  let tagHTML = "";
  if (showTag) {
    tagHTML = `
      <p class="activity-tag">
        <i class="fa-solid fa-chalkboard-user"></i>
        <span>${tag}</span>
      </p>
    `;
  }
  return `
    <div class="activity" tag="${tag}">
      <img
        src="../assets/images/activities/${tag}/${activityImagePath}"
        alt="The image of ${activityTitle}"
      />

      <article>
        <div>
          ${tagHTML}
          <p class="activity-date">
            <i class="fa-regular fa-calendar"></i> <span>${activityDate}</span>
          </p>
        </div>
        <h2 class="activity-name">${activityTitle}</h2>
        <p class="secondary-text activity-summary">${activityDesc}</p>
        <a href="${activityLink}" class="primary-button"
          >Learn More <i class="fa-solid fa-arrow-right"></i
        ></a>
      </article>
    </div>
  `;
};

/**
 * The renderActivities function is used to render the activities
 *
 * @param activities - The activities to render
 * @param showTag - Whether to show the tag or not
 */
const renderActivities = (activities, showTag) => {
  const activitiesContainer = document.querySelector(".activities-container");
  activitiesContainer.innerHTML = "";
  activities.forEach((activity) => {
    activitiesContainer.innerHTML += generateActivityHTML(activity, showTag);
  });

  document.querySelectorAll(".activity").forEach((activity) => {
    observeActivities.observe(activity);
  });
};

/**
 * This function is used to handle the main functionality of the activities
 *
 * @param {string} selectedTag - The tag to filter by
 */
const activitiesMain = (selectedTag = getUrlTag()) => {
  document.querySelectorAll(".activities-nav-link").forEach((link) => {
    const navType = link.getAttribute("nav-type");
    link.classList.toggle("active", navType === selectedTag);
  });
  if (selectedTag !== "all") {
    const title =
      selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1) + "s";
    document.querySelector(".activities-navbar h1 span").textContent = title;
  }

  const activities = getActivitiesByTag(selectedTag);
  const isPaginationAvailable = activities.length >= 12;
  $(".pagination").attr("available", isPaginationAvailable.toString());

  if (isPaginationAvailable) {
    initPagination(activities);
  } else {
    renderActivities(activities, selectedTag);
  }
};

/**
 * This function is used to initialize the pagination
 *
 * @param {Array<Activities>} activities
 */
const initPagination = (activities) => {
  const pagination = document.querySelector(".pagination");
  pagination.setAttribute("available", "true");

  const pageNavContainer = document.querySelector(".page-nav-container");
  pageNavContainer.innerHTML = "";
  const totalPages = Math.ceil(activities.length / 12);
  for (let i = 1; i <= totalPages; i++) {
    const pageNumberElement = document.createElement("button");
    pageNumberElement.classList.add("page-number", "row-center");
    if (i === 1) {
      pageNumberElement.classList.add("page-active");
    }
    pageNumberElement.setAttribute("nav-type", i);
    pageNumberElement.setAttribute("page-number", i);
    pageNumberElement.textContent = i;
    pageNavContainer.appendChild(pageNumberElement);
  }

  changePage(1);

  $(".page-number").click((e) =>
    changePage(Number(e.target.getAttribute("page-number")))
  );
  $(".pagination-btn").click((e) =>
    paginationActionButtons(e.target.getAttribute("action"))
  );
};

/**
 * This function is used to change the page based on the page number
 *
 * @param {Number} pageNumber - The number of the page to change to
 */
const changePage = (pageNumber) => {
  const startIndex = 12 * (pageNumber - 1);
  const endIndex = 12 * pageNumber;
  const allTaggedActivities = getActivitiesByTag(getUrlTag());
  const selectedActivities = allTaggedActivities.slice(startIndex, endIndex);
  window.scrollTo(0, 0);
  renderActivities(selectedActivities, getUrlTag());
  updatePagination(pageNumber, allTaggedActivities.length);
};

/**
 * This function is used to update the pagination
 *
 * @param {Number} pageNumber - The number of the page
 * @param {Number} activitiesNumber - The length of the activities
 */
const updatePagination = (pageNumber, activitiesNumber) => {
  const pageNumbers = document.querySelectorAll(".page-number");
  const minimumPageNumber = 1;
  const maximumPageNumber = Math.ceil(activitiesNumber / 12);

  pageNumbers.forEach((page) =>
    page.classList.toggle(
      "page-active",
      page.getAttribute("page-number") == pageNumber
    )
  );

  const nextButton = document.querySelector(".pagination-btn[action='next']");
  const prevButton = document.querySelector(".pagination-btn[action='prev']");

  if (pageNumber === minimumPageNumber) {
    nextButton.classList.remove("hidden");
    prevButton.classList.add("hidden");
  } else if (pageNumber === maximumPageNumber) {
    prevButton.classList.remove("hidden");
    nextButton.classList.add("hidden");
  } else {
    prevButton.classList.remove("hidden");
    nextButton.classList.remove("hidden");
  }
};

/**
 * This function is used to perform an action on the pagination
 *
 * @param {String} action - The action to perform
 */
const paginationActionButtons = (action) => {
  const pageNumbers = document.querySelectorAll(".page-number");
  const currentPageNumber = getActivePageNumber(pageNumbers);

  const nextPage =
    action === "next" ? currentPageNumber + 1 : currentPageNumber - 1;

  changePage(nextPage);
};

/**
 * This function is used to get the active page number
 *
 * @param {Array} pageNumbers - The array of page numbers
 * @returns {Number} - The pageNumber with a class of page-active
 */
const getActivePageNumber = (pageNumbers) => {
  let activePageNumber;
  pageNumbers.forEach((page) => {
    if (page.classList.contains("page-active")) {
      activePageNumber = Number(page.getAttribute("page-number"));
    }
  });

  return activePageNumber;
};

$().ready(() => {
  activitiesMain();
  tags.forEach((tag) => {
    $(`.activities-nav-link[nav-type='${tag}']`).click(() => {
      activitiesMain(`${tag}`);
    });
  });
});
