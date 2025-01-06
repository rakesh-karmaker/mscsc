import Hero from "@/components/home-components/hero-components/Hero";
import AboutUs from "@/components/about-components/About";
import Events from "@/components/home-components/events-components/Events";
import Articles from "@/components/home-components/articles-components/Articles";
import HomeEcs from "@/components/home-components/home-ec-components/HomeEcs";
import Contact from "@/components/contact-components/Contact";
import executivesData from "@/services/api/executivesData";
import { useQuery } from "@tanstack/react-query";
import { getAllActivities } from "@/services/GetService";
import FilterError from "@/utils/FilterError";

const Home = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["allActivities", 1, "all", "", ""],
    queryFn: () => getAllActivities(1, "all", "", ""),
    staleTime: 1000 * 60 * 5,
  });
  if (error) {
    <FilterError error={error} />;
    return;
  }

  const activities = data?.data;

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
