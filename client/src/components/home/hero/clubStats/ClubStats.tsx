import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import "./clubStats.css";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function ClubStats({
  mobileClass,
}: {
  mobileClass: string;
}): ReactNode {
  {
    /* <!-- Club stats is a section where we can show some stats about the club --> */
    /* <!--TODO Should change in every year --> */
  }

  useGSAP(() => {
    gsap.fromTo(
      ".stats",
      {
        y: "50px",
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.1,
        scrollTrigger: ".stats",
      }
    );
  });

  useEffect(() => {
    const numberObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          count(entry.target as HTMLElement);
          numberObserver.unobserve(entry.target);
        }
      });
    }, {});

    const numberValues = document.querySelectorAll(".number-value");
    numberValues.forEach((numberValue) => {
      numberObserver.observe(numberValue);
    });
  }, []);
  return (
    <div
      className={`club-stats ${mobileClass == undefined ? "" : mobileClass}`}
    >
      <p className="stats-heading">The milestones we have achieved:</p>
      <div className="club-stats-container">
        <ClubStat value="5" thousand={true}>
          Past club <br /> Members
        </ClubStat>
        <ClubStat value="7">
          Years of <br /> Connectivity
        </ClubStat>
        <ClubStat value="4">
          Successful <br /> Fests
        </ClubStat>
        <ClubStat value="20">
          Interesting <br /> Workshops
        </ClubStat>
      </div>
    </div>
  );
}

function ClubStat({
  value,
  children,
  thousand,
}: {
  value: string;
  children: ReactNode;
  thousand?: boolean;
}) {
  return (
    <p className="stats">
      <span className="stats-number">
        <span className="number-value" data-value={value}>
          0
        </span>
        {thousand ? "K+" : "+"}
      </span>
      <span className="stats-name">{children}</span>
    </p>
  );
}

function count(ele: HTMLElement) {
  let number = 0;
  const limit = ele.getAttribute("data-value");
  const interval = 1000;
  const duration = Math.floor(interval / (limit ? parseInt(limit) : 1));

  const counterInterval = setInterval(() => {
    number++;
    ele.innerText = number.toString();
    if (number == parseInt(limit ? limit : "0")) {
      clearInterval(counterInterval);
    }
  }, duration);
}
