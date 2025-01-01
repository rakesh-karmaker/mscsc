import Hero from "../components/home-components/hero-components/Hero";
import AboutUs from "../components/home-components/about-components/About";
import Events from "../components/home-components/events-components/Events";
import Articles from "../components/home-components/articles-components/Articles";
import HomeEcs from "../components/home-components/home-ec-components/HomeEcs";
import Contact from "../components/home-components/contact-components/Contact";
import executivesData from "../api/executivesData.json";

const Home = () => {
  return (
    <main className="page-home">
      <Hero />
      <AboutUs />
      <Events />
      <Articles />
      <HomeEcs data={executivesData} />
      <Contact />
    </main>
  );
};
export default Home;
