import Hero from "@/components/home-components/hero-components/Hero";
import AboutUs from "@/components/about-components/About";
import Events from "@/components/home-components/events-components/Events";
import Articles from "@/components/home-components/articles-components/Articles";
import HomeEcs from "@/components/home-components/home-ec-components/HomeEcs";
import Contact from "@/components/contact-components/Contact";
import executivesData from "@/services/api/executivesData";
import { useActivities } from "@/contexts/ActivitiesContext";

const Home = () => {
  const { allActivities: activities, allActivitiesIsLoading: isLoading } =
    useActivities();

  return (
    <main className="page-home">
      <Hero />
      <AboutUs />
      <Events activities={activities} isLoading={isLoading} />
      <Articles activities={activities} isLoading={isLoading} />
      <HomeEcs data={executivesData} />
      <Contact />
    </main>
  );
};
export default Home;
