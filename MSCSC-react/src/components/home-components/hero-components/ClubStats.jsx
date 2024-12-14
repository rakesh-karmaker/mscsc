import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const ClubStats = () => {
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
          count(entry.target);
          numberObserver.unobserve(entry.target);
        }
      });
    });

    const numberValues = document.querySelectorAll(".number-value");
    numberValues.forEach((numberValue) => {
      numberObserver.observe(numberValue);
    });
  });
  return (
    <div className="club-stats">
      <h3>The milestones we have achieved:</h3>
      <div className="club-stats-container">
        <ClubState value="5" thousand={true}>
          Past club <br /> Members
        </ClubState>
        <ClubState value="7">
          Years of <br /> Connectivity
        </ClubState>
        <ClubState value="4">
          Successful <br /> Fests
        </ClubState>
        <ClubState value="20">
          Interesting <br /> Workshops
        </ClubState>
      </div>
    </div>
  );
};

const ClubState = ({ value, children, thousand }) => {
  return (
    <h3 className="stats">
      <span className="stats-number">
        <span className="number-value" value={value}>
          0
        </span>
        {thousand ? "K+" : "+"}
      </span>
      <span className="stats-name">{children}</span>
    </h3>
  );
};

const count = (ele) => {
  let number = 0;
  const limit = ele.getAttribute("value");
  const interval = 1000;
  const duration = Math.floor(interval / limit);

  const counterInterval = setInterval(() => {
    number++;
    ele.innerText = number;
    if (number == limit) {
      clearInterval(counterInterval);
    }
  }, duration);
};

export default ClubStats;
