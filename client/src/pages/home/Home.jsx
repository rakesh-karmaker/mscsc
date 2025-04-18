import Hero from "@/components/homeComponents/heroComponents/hero/Hero";
import AboutUs from "@/components/aboutComponents/aboutSection/AboutSection";
import Events from "@/components/homeComponents/eventsComponents/Events/Events";
import Articles from "@/components/homeComponents/articlesComponents/Articles/Articles";
import HomeEcs from "@/components/homeComponents/homeExecutivesComponents/HomeEcs";
import Contact from "@/components/contactComponents/ContactSection";
import executivesData from "@/services/api/executivesData";
import { useQuery } from "@tanstack/react-query";
import { getArticles, getEvents } from "@/services/GetService";
import useErrorNavigator from "@/hooks/useErrorNavigator";

const Home = () => {
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
    isError: eventsIsError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  useErrorNavigator(eventsIsError, eventsError);
  const events = eventsData?.data || [];

  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: articlesError,
    isError: articlesIsError,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  useErrorNavigator(articlesIsError, articlesError);
  const articles = articlesData?.data || [];

  return (
    <>
      <main className="page-home">
        <Hero />
        <AboutUs />
        <Events events={events} isLoading={eventsLoading} />
        <Articles articles={articles} isLoading={articlesLoading} />
        <HomeEcs data={executivesData} />
        <Contact />
      </main>
    </>
  );
};
export default Home;
