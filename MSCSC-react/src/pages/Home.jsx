import Header from "../components/nav-bars/Header";
import Footer from "../components/Footer";
import Hero from "../components/home-components/hero-components/Hero";
import AboutUs from "../components/home-components/about-components/About";
import Events from "../components/home-components/events-components/Events";
import Articles from "../components/home-components/articles-components/Articles";
import HomeEcs from "../components/home-components/home-ec-components/HomeEcs";
import Contact from "../components/home-components/contact-components/Contact";
import activitiesData from "../api/activitiesData.json";
import executivesData from "../api/executivesData.json";
import $ from "jquery";
import "../components/home-components/Home.css";
import { useState, useEffect } from "react";

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    loaded ? null : navbarLinkTrigger();
    setLoaded(true);
  }, []);

  return (
    <>
      <Header page="home" />
      <main className="page-home">
        <Hero />
        <AboutUs />
        <Events data={activitiesData} />
        <Articles data={activitiesData} />
        <HomeEcs data={executivesData} />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

const navbarLinkTrigger = () => {
  // This part will add the active class to the nav-link that the user is currently on
  const sections = document.querySelectorAll(".page-section");

  let active = [];
  let thresHold = window.innerWidth <= 900 ? 0.3 : 0.55;

  const observer = new IntersectionObserver(
    (entities) => {
      entities.forEach((entity) => {
        const id = entity.target.id;
        console.log(id);
        if (entity.isIntersecting) {
          if (active.length > 0) {
            $(`.nav-link a[nav-link-name='${active[0]}']`).removeClass(
              "active"
            );
            active.pop(active[0]);
          }

          id == "events" || id == "articles"
            ? $(`.nav-link:has(ul.activities) > a`).addClass("active")
            : $(`.nav-link:has(ul.activities) > a`).removeClass("active");

          active.push(id);
          $(`.nav-link a[nav-link-name='${id}']`).addClass("active");
          // console.log($(`.nav-link a[nav-link-name='${id}']`));
        }
      });
    },
    {
      threshold: thresHold,
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
};

export default Home;
