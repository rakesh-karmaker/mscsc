import ClubIntro from "@/components/homeComponents/heroComponents/clubIntro/ClubIntro";
import ClubStats from "@/components/homeComponents/heroComponents/clubStats/ClubStats";
import "./Hero.css";
import MscscTag from "@/components/UI/MscscTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeroImageSwiper from "@/components/swipers/heroImageSwiper/HeroImageSwiper";
import { NavLink } from "react-router-dom";
const Hero = () => {
  return (
    <>
      <section id="home" className="hero-section row-center page-section">
        <div className="hero-section-container row-center">
          <article className="hero-section-left">
            <MscscTag />
            <div className="club-intro-container">
              <ClubIntro />

              {window.innerWidth <= 1080 ? <HeroActionBtns /> : null}
            </div>

            <ClubStats mobileClass={"mobile-stats"} />
          </article>

          <div className="hero-section-right col-center">
            <HeroImageSwiper />

            <HeroActionBtn />
          </div>
        </div>
        {window.innerWidth <= 1080 ? <div className="circle"></div> : null}
      </section>
    </>
  );
};

const HeroActionBtns = () => {
  return (
    <div className="hero-action-btns row-center">
      <NavLink className={"primary-button"} to="/register">
        Join Us
      </NavLink>
      <NavLink className={"primary-button secondary-button"} to="/members">
        See Others
      </NavLink>
    </div>
  );
};

const HeroActionBtn = () => {
  return (
    <NavLink className={"join-btn"} to="/auth/register">
      <div>
        <div className="pulse row-center"></div>
        <p>Join Us With Our Journey</p>
      </div>
      <p>
        <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
      </p>
    </NavLink>
  );
};

export default Hero;
