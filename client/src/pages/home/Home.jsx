import Hero from "@/components/homeComponents/heroComponents/hero/Hero";
import AboutUs from "@/components/aboutComponents/aboutSection/AboutSection";
import Events from "@/components/homeComponents/eventsComponents/Events/Events";
import Articles from "@/components/homeComponents/articlesComponents/Articles/Articles";
import HomeEcs from "@/components/homeComponents/homeExecutivesComponents/HomeEcs";
import Contact from "@/components/contactComponents/ContactSection";
import executivesData from "@/services/api/executivesData";
import { useActivities } from "@/contexts/ActivitiesContext";

const Home = () => {
  const { allActivities: activities, allActivitiesIsLoading: isLoading } =
    useActivities();

  return (
    <>
      <main className="page-home">
        <Hero />
        <AboutUs />
        <Events activities={activities} isLoading={isLoading} />
        <Articles activities={activities} isLoading={isLoading} />
        <HomeEcs data={executivesData} />
        <Contact />
      </main>
    </>
  );
};
export default Home;
