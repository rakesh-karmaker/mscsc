import ClubIntro from "./ClubIntro";
import ClubStats from "./ClubStats";
import ImageSlider from "./ImageSlide";
import "./Hero.css";
import $ from "jquery";
const Hero = () => {
  setTimeout(() => {
    $(".mscsc-tag").addClass("active");
  }, 300);

  return (
    <>
      <section className="hero-section row-center page-section">
        <div className="hero-section-container row-center">
          <article className="hero-section-left">
            <div className="mscsc-tag row-center">
              <p>Science & Technology Club</p>
              <span className="name row-center">MSCSC</span>
            </div>

            <ClubIntro />
            {window.innerWidth > 1080 ? <ClubStats /> : null}
          </article>

          <div className="hero-section-right col-center">
            <ImageSlider />

            <a className="join-btn row-center" href="#">
              <div>
                <div className="pulse row-center"></div>
                <p>Join Us With Our Journey</p>
              </div>
              <p>
                <i className="fa-solid fa-arrow-right-long"></i>
              </p>
            </a>
          </div>
        </div>
        {window.innerWidth <= 1080 ? <HeroSectionBottomCurve /> : null}
      </section>

      {window.innerWidth <= 1080 ? <ClubStats /> : null}
    </>
  );
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
