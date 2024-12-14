import Header from "../components/nav-bars/Header";
import Footer from "../components/Footer";
import Hero from "../components/home-components/hero-components/Hero";
import AboutUs from "../components/home-components/about-components/About";
import Events from "../components/home-components/events-components/Events";
import activitiesData from "../api/activitiesData.json";
import Articles from "../components/home-components/articles-components/Articles";
import "../components/home-components/Home.css";

const Home = () => {
  return (
    <>
      <Header />
      <main className="page-home">
        <Hero />
        <AboutUs />
        <Events data={activitiesData} />
        <Articles data={activitiesData} />
      </main>
      <Footer />
    </>
  );
};

export default Home;
