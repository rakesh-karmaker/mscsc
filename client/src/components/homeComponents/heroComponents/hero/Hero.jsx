import ClubIntro from "@/components/homeComponents/heroComponents/clubIntro/ClubIntro";
import ClubStats from "@/components/homeComponents/heroComponents/clubStats/ClubStats";
import "./Hero.css";
import MscscTag from "@/components/UI/MscscTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeroImageSwiper from "@/components/swipers/heroImageSwiper/HeroImageSwiper";
const Hero = () => {
  return (
    <>
      <section id="home" className="hero-section row-center page-section">
        <div className="hero-section-container row-center">
          <article className="hero-section-left">
            <MscscTag />
            <ClubIntro />

            {/* {window.innerWidth > 1080 ? <ClubStats /> : null} */}
            <ClubStats mobileClass={"mobile-stats"} />
          </article>

          <div className="hero-section-right col-center">
            <HeroImageSwiper />

            <HeroActionBtn />
          </div>
        </div>
        {window.innerWidth <= 1080 ? <HeroSectionBottomCurve /> : null}
      </section>

      {/* {window.innerWidth <= 1080 ? (
        <ClubStats mobileClass={"mobile-stats"} />
      ) : null} */}
    </>
  );
};

const HeroActionBtn = () => {
  if (window.innerWidth > 450) {
    return (
      <a className="join-btn" href="/register">
        <div>
          <div className="pulse row-center"></div>
          <p>Join Us With Our Journey</p>
        </div>
        <p>
          <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
        </p>
      </a>
    );
  } else {
    return (
      <a className="primary-button" href="/register">
        Join Us
      </a>
    );
  }
};

const HeroSectionBottomCurve = () => {
  return (
    <div className="shape">
      <svg viewBox="0 0 1500 200">
        <path d="m 0,240 h 1500.4828 v -71.92164 c 0,0 -286.2763,-81.79324 -743.19024,-81.79324 C 300.37862,86.28512 0,168.07836 0,168.07836 Z"></path>
      </svg>
    </div>
  );
};

export default Hero;
