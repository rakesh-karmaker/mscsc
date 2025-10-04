import type { ReactNode } from "react";
import ClubBenefit from "./ClubBenefit";
import PrimaryBtn from "@/components/ui/PrimaryBtn";

import "./clubDescription.css";

export default function ClubDescription(): ReactNode {
  return (
    <div className="club-description">
      <p>Join</p>
      <h2>
        Unlock Your Potential with{" "}
        <span className="highlighted-text">MSCSC</span>
      </h2>
      <p className="secondary-text">
        Joining MSCSC offers essential skill development and valuable
        educational resources. This community enhances your personal and
        professional skills while connecting you with growth-oriented
        individuals. It fosters networking and shared insights, enriching your
        experience and broadening your horizons.
      </p>

      <div className="benefits-container row-center">
        <ClubBenefit
          title="Skill Development"
          icon="skilldev.png"
          marginBottom="4px"
        >
          Boost your skills and knowledge with engaging hands-on projects and
          workshops designed to accommodate all levels of expertise.
        </ClubBenefit>

        <ClubBenefit title="Community Support" icon="communitysupport.png">
          Engage with fellow enthusiasts and experienced mentors who share your
          deep passion for both science and technology innovation.
        </ClubBenefit>
      </div>
      <PrimaryBtn link="https://www.facebook.com/MSCSC2014" name="Facebook">
        Learn More
      </PrimaryBtn>
    </div>
  );
}
