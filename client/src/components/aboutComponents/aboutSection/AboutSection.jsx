import ClubDescription from "@/components/aboutComponents/clubDesc/ClubDesc";
import Departments from "@/components/aboutComponents/departments/Departments";
import "./AboutSection.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const AboutUs = () => {
  return (
    <section id="about" className="col-center page-section">
      <div className="about-article-container">
        <ClubDescription />
        <LazyLoadImage
          src="/about-club-section-img.webp"
          alt="A picture of club members"
          effect="blur"
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
