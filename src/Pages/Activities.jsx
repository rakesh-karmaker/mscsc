import ActivitiesNavbar from "../components/nav-bars/ActivitiesNavbar";
import Activity from "../components/activities-components/Activity";
import "../components/activities-components/Activities.css";
import activitiesData from "../api/activitiesData.json";
import { useState, useEffect } from "react";
import Pagination from "../components/activities-components/Pagination";
const Activities = () => {
  const [topic, setTopic] = useState("Activities");
  const [userSelected, setUserSelected] = useState("false");
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPAge = 12;
  const selectedData =
    topic === "Activities"
      ? activitiesData
      : activitiesData.filter((data) => data.tag == topic);
  const handleTopicsClick = (topic) => {
    setTopic(topic);
    setUserSelected("true");
    setCurrentPage(1);
    document.querySelectorAll(".activities-nav-link").forEach((navLink) => {
      navLink.classList.remove("active");
      if (navLink.getAttribute("nav-type") === topic) {
        navLink.classList.add("active");
      }
    });
  };
  // Observe the executive members
  useEffect(() => {
    document.querySelectorAll(".activity").forEach((executiveMember) => {
      observeExecutiveMember.observe(executiveMember);
    });
  });

  const lastPageIndex = currentPage * activitiesPerPAge;
  const firstPageIndex = lastPageIndex - activitiesPerPAge;
  const currentActivities = selectedData.slice(firstPageIndex, lastPageIndex);

  const handleSetCurrentPageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  return (
    <main className="page-activities">
      <ActivitiesNavbar topic={topic} onClick={handleTopicsClick} />
      <section className="activities-container">
        {currentActivities.map((activity) => {
          return (
            <Activity
              key={activity.activityTitle}
              data={activity}
              select={userSelected}
            />
          );
        })}
      </section>
      <Pagination
        totalActivities={selectedData.length}
        activitiesPerPAge={activitiesPerPAge}
        setCurrentPage={handleSetCurrentPageClick}
        currentPage={currentPage}
      />
    </main>
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
export default Activities;
