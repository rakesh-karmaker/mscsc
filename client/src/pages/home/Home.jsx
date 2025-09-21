import Hero from "@/components/homeComponents/heroComponents/hero/Hero";
import AboutSection from "@/components/aboutComponents/aboutSection/AboutSection";
import Events from "@/components/homeComponents/eventsComponents/Events/Events";
import Articles from "@/components/homeComponents/articlesComponents/Articles/Articles";
import HomeEcs from "@/components/homeComponents/homeExecutivesComponents/HomeEcs";
import Contact from "@/components/contactComponents/ContactSection";
import executivesData from "@/services/data/executivesData";
import { useQuery } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import { getHomeActivities } from "@/lib/api/activities";

const Home = () => {
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
        <Hero />
        <AboutSection />
        <Events events={events} isLoading={homeActivitiesLoading} />
        <Articles articles={articles} isLoading={homeActivitiesLoading} />
        <HomeEcs data={executivesData} />
        <Contact />
      </main>
    </>
  );
};
export default Home;
