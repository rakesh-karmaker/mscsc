import ClubIntro from "./ClubIntro";
import ClubStats from "./ClubStats";
import "./Hero.css";

const Hero = () => {
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
            <ClubStats />
          </article>
        </div>
      </section>

      {window.innerWidth <= 1080 ? <ClubStats /> : null}
    </>
  );
};

export default Hero;
