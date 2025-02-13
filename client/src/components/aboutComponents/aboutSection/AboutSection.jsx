import ClubDescription from "@/components/aboutComponents/clubDesc/ClubDesc";
import Departments from "@/components/aboutComponents/departments/Departments";
import "./AboutSection.css";

const AboutUs = () => {
  return (
    <section id="about" className="col-center page-section">
      <div className="about-article-container">
        <ClubDescription />
        <img
          src="/about-club-section-img.webp"
          rel="preload"
          fetchpriority="high"
          alt="A picture of club members"
          width={"690px"}
          height={"650px"}
        />
      </div>

      <div className="dpts-section col-center">
        <div>
          <h2 className="section-heading">CLUB DEPARTMENTS</h2>
          <p className="secondary-text section-sub-heading">
            Sectors we are divided into, inside the club
          </p>
        </div>

        <Departments />
      </div>
    </section>
  );
};

export default AboutUs;
