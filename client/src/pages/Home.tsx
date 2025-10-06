import HeroContainer from "@/components/home/hero/heroContainer/HeroContainer";
import AboutContainer from "@/components/about/aboutContainer/AboutContainer";
import EventsContainer from "@/components/home/events/eventsContainer/EventsContainer";
import ArticlesContainer from "@/components/home/articles/articlesContainer/ArticlesContainer";
import HomeExecutivesContainer from "@/components/home/HomeExecutivesContainer";
import ContactContainer from "@/components/contact/ContactContainer";
import executivesData from "@/services/data/executivesData.json";
import { useQuery } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import { getHomeActivities } from "@/lib/api/activities";
import type { ReactNode } from "react";

export default function Home(): ReactNode {
  const {
    data: homeActivities,
    isLoading: homeActivitiesLoading,
    error: homeActivitiesError,
    isError: homeActivitiesIsError,
  } = useQuery({
    queryKey: ["homeActivities"],
    queryFn: getHomeActivities,
  });

  useErrorNavigator(homeActivitiesIsError, homeActivitiesError);

  const events = homeActivities?.data?.events || [];
  const articles = homeActivities?.data?.articles || [];

  return (
    <>
      <main className="page-home">
        <HeroContainer />
        <AboutContainer />
        <EventsContainer events={events} isLoading={homeActivitiesLoading} />
        <ArticlesContainer
          articles={articles}
          isLoading={homeActivitiesLoading}
        />
        <HomeExecutivesContainer data={executivesData} />
        <ContactContainer />
      </main>
    </>
  );
}
