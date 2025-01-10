import ActivitiesNavbar from "../components/nav-bars/ActivitiesNavbar";
import Activity from "../components/activities-components/Activity";
import "../components/activities-components/Activities.css";
import { useEffect } from "react";
import Pagination from "../components/UI/Pagination/Pagination";
import { useActivities } from "@/contexts/ActivitiesContext";
import Loader from "@/components/UI/Loader/Loader";
import EmptyData from "@/components/UI/EmptyData/EmptyData";
import MetaTags from "@/layout/MetaTags";
const Activities = ({ admin, ...rest }) => {
  const {
    activities,
    length,
    tag,
    setTag,
    search,
    setSearch,
    page,
    isLoading,
    setPage,
  } = useActivities();

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
    <>
      <MetaTags
        title="MSCSC - Activities"
        description="MSCSC is the ideal place for Math, Science, Biology, IT, and Astronomy enthusiasts, offering top-notch learning, hands-on experiences, and expert guidance."
      />
      <main className="page-activities">
        <ActivitiesNavbar
          tag={tag}
          setTag={setTag}
          search={search}
          setSearch={setSearch}
        />
        <section className="activities-container">
          {isLoading ? (
            <Loader />
          ) : length === 0 ? (
            <EmptyData />
          ) : (
            activities?.map((activity) => {
              return (
                <Activity
                  key={activity._id}
                  data={activity}
                  selectedTag={tag}
                  admin={admin}
                  {...rest}
                />
              );
            })
          )}
        </section>
        <Pagination
          length={length}
          elementsPerPage={elementsPerPage}
          setPage={handleSetCurrentPageClick}
          currentPage={page}
        />
      </main>
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
    threshold: 0.1,
  }
);
export default Activities;
