import type { ReactNode } from "react";
import ClubDescription from "../clubDescription/ClubDescription";
import ClubDepartments from "../clubDepartments/ClubDepartments";

import "./aboutContainer.css";

export default function AboutContainer(): ReactNode {
  return (
    <section id="about" className="col-center page-section">
      <div className="about-article-container">
        <ClubDescription />
        <img
          src="/about-club-section-img.webp"
          alt="A picture of club members"
          className="about-article-img"
          loading="lazy"
        />
      </div>

      <div className="dpts-section col-center">
        <div>
          <h2 className="section-heading">CLUB DEPARTMENTS</h2>
          <p className="secondary-text section-sub-heading">
            Sectors we are divided into, inside the club
          </p>
        </div>

        <ClubDepartments />
      </div>
    </section>
  );
}
