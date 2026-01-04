import HeroContainer from "@/components/home/hero/hero-container/hero-container";
import AboutContainer from "@/components/about/about-container/about-container";
import EventsContainer from "@/components/home/events/events-container/events-container";
import ArticlesContainer from "@/components/home/articles/articles-container/articles-container";
import HomeExecutivesContainer from "@/components/home/home-executives-container";
import ContactContainer from "@/components/contact/contact-container";
import executivesData from "@/services/data/executives-data.json";
import { useQuery } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/use-error-navigator";
import { getHomeActivities } from "@/lib/api/activities";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

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
      {/* page meta data */}
      <Helmet>
        <title>MSCSC - Monipur School & College Science Club</title>
        <meta
          property="og:title"
          content="MSCSC - Monipur School & College Science Club"
        />
        <meta
          name="twitter:title"
          content="MSCSC - Monipur School & College Science Club"
        />
        <meta name="og:url" content="https://mscsc.netlify.app/" />
        <link rel="canonical" href={`https://mscsc.netlify.app/`} />
      </Helmet>

      {/* page content */}
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
