import type { ReactNode } from "react";
import { HeroActionBtn, HeroActionBtns } from "../HeroActionBtns";
import MscscTag from "@/components/ui/MscscTag";
import ClubIntro from "../clubIntro/clubIntro";
import ClubStats from "../clubStats/ClubStats";
import HeroContainerSwiper from "@/components/swipers/heroContainerSwiper/HeroContainerSwiper";

import "./heroContainer.css";

export default function HeroContainer(): ReactNode {
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
            <HeroContainerSwiper />

            <HeroActionBtn />
          </div>
        </div>
        {window.innerWidth <= 1080 ? <div className="circle"></div> : null}
      </section>
    </>
  );
}
