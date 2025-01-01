import ActivitiesNavbar from "../components/nav-bars/ActivitiesNavbar";
import Activity from "../components/activities-components/Activity";
import "../components/activities-components/Activities.css";
import { useEffect } from "react";
import Pagination from "../components/activities-components/Pagination";
import { useActivities } from "@/contexts/ActivitiesContext";
const Activities = ({ admin, ...rest }) => {
  const { activities, length, tag, setTag, search, setSearch, page, setPage } =
    useActivities();

  const elementsPerPage = 12;

  useEffect(() => {
    document.querySelectorAll(".activity").forEach((executiveMember) => {
      observeExecutiveMember.observe(executiveMember);
    });
  }, [activities]);

  const handleSetCurrentPageClick = (page) => {
    setPage(page);
    window.scrollTo(0, 0);
  };
  return (
    <main className="page-activities">
      <ActivitiesNavbar
        tag={tag}
        setTag={setTag}
        search={search}
        setSearch={setSearch}
      />
      <section className="activities-container">
        {activities?.map((activity) => {
          return (
            <Activity
              key={activity._id}
              data={activity}
              selectedTag={tag}
              admin={admin}
              {...rest}
            />
          );
        })}
      </section>
      <Pagination
        length={length}
        elementsPerPage={elementsPerPage}
        setPage={handleSetCurrentPageClick}
        currentPage={page}
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
    threshold: 0.1,
  }
);
export default Activities;
