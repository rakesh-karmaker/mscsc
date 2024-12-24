import PrimaryBtn from "@/components/UI/PrimaryBtn";
import SectionHeader from "@/components/UI/SectionHeader";
import { useState, useRef } from "react";
import EventSwiper from "@/components/home-components/events-components/EventSwiper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

import "./Events.css";

const Events = ({ data }) => {
  const eventStatuses = ["happened", "all", "upcoming"];
  const [status, setStatus] = useState("all");
  const eventSwiperRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      eventSwiperRef.current,
      {
        y: "100px",
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: eventSwiperRef.current,
      }
    );
  });

  const filterData = (status, data) => {
    const eventData = data
      .filter(
        (activity) => activity.tag == "event" || activity.tag == "workshop"
      )
      .slice(0, 7);

    if (status === "all") {
      return eventData;
    }

    const filteredByStatusData = eventData.filter(
      (event) => event.status == status
    );
    return filteredByStatusData.length == 0 ? false : filteredByStatusData;
  };

  const filteredEventData = filterData(status, data);

  return (
    <section id="events" className="page-section col-center">
      <div className="col-center">
        <SectionHeader
          title={"our events"}
          description="Stunning events and fests organized by us"
        >
          <PrimaryBtn link="/activities" name="See All">
            See All
          </PrimaryBtn>
        </SectionHeader>

        <div className="event-status-nav">
          {eventStatuses.map((statusLink) => (
            <button
              key={statusLink}
              className={`${statusLink} ${
                status == statusLink ? "nav-active" : ""
              }`}
              status-name={statusLink}
              onClick={() => setStatus(statusLink)}
            >
              {statusLink}
            </button>
          ))}
        </div>

        <div ref={eventSwiperRef} className="events-container">
          {filteredEventData == false ? (
            <p className="secondary-text">No events to show</p>
          ) : (
            <EventSwiper filterEventsData={filteredEventData} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;
