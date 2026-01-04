import type { ReactNode } from "react";
import { HeroActionBtn, HeroActionBtns } from "../hero-action-btns";
import MscscTag from "@/components/ui/mscsc-tag";
import ClubIntro from "../clubIntro/clubIntro";
import ClubStats from "../club-stats/club-stats";
import HeroContainerSwiper from "@/components/swipers/hero-container-swiper/hero-container-swiper";

import "./hero-container.css";

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
