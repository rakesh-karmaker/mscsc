import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useActivities } from "@/contexts/activities-context";
import { useLocation } from "react-router-dom";
import Loader from "@/components/ui/loader/loader";
import Empty from "@/components/ui/empty/empty";
import PaginationContainer from "@/components/ui/pagination-container/pagination-container";
import ActivitiesNavbar from "@/layouts/activities-navbar/activities-navbar";
import ActivityCard from "@/components/activity-card/activity-card";
import type { ActivityPreview } from "@/types/activity-types";
import { Helmet } from "react-helmet-async";

export default function Activities({
  admin,
  ...rest
}: {
  admin?: boolean;
  setSelectedActivity?: Dispatch<SetStateAction<ActivityPreview | null>>;
}) {
  const link = useLocation();
  const searchParams = new URLSearchParams(link.search);
  const linkTag = searchParams.get("tag");

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

  useEffect(() => {
    if (linkTag && search === "") {
      setTag(linkTag);
    }
  }, [isLoading, linkTag]);

  const handleSetCurrentPageClick = (page: number) => {
    setPage(page);
    window.scrollTo(0, 0);
  };
  return (
    <>
      {/* page meta data */}
      <Helmet>
        <title>MSCSC - Activities</title>
        <meta property="og:title" content="MSCSC - Activities" />
        <meta name="twitter:title" content="MSCSC - Activities" />
        <meta name="og:url" content="https://mscsc.netlify.app/activities" />
        <link rel="canonical" href={`https://mscsc.netlify.app/activities`} />
      </Helmet>

      {/* page content */}
      <main
        className={`page-activities w-full min-h-screen max-w-max-width ${
          admin
            ? ""
            : "!pt-[calc(var(--nav-height)+3rem)] !pb-25 max-[1000px]:!pt-[calc(var(--nav-height)+2rem)]"
        } flex flex-col max-[1000px]:gap-10`}
      >
        <ActivitiesNavbar
          tag={tag}
          setTag={setTag}
          search={search}
          setSearch={setSearch}
          admin={admin}
        />
        <section className="activities-container">
          {isLoading ? (
            <Loader />
          ) : length === 0 ? (
            <Empty />
          ) : (
            activities?.map((activity) => {
              return (
                <ActivityCard
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
        <PaginationContainer
          length={length}
          elementsPerPage={elementsPerPage}
          setPage={handleSetCurrentPageClick}
          currentPage={page}
        />
      </main>
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
    threshold: 0,
  }
);
