import PrimaryBtn from "@/components/UI/PrimaryBtn";
import SectionHeader from "@/components/UI/SectionHeader";
import { useState, useRef, useEffect } from "react";
import EventSwiper from "@/components/swipers/eventsSwiper/EventsSwiper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

import "./Events.css";
import Loader from "@/components/UI/Loader/Loader";

const Events = ({ events, isLoading }) => {
  const eventStatuses = ["happened", "all", "upcoming"];
  const [status, setStatus] = useState("all");
  const eventSwiperRef = useRef(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

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

  useEffect(() => {
    if (status === "all") {
      setFilteredEvents(events);
    } else if (status === "happened") {
      const filteredByStatusData = events?.filter(
        (event) => new Date(event.date) < new Date()
      );
      setFilteredEvents(filteredByStatusData);
    } else if (status === "upcoming") {
      const filteredByStatusData = events?.filter(
        (event) => new Date(event.date) > new Date()
      );
      setFilteredEvents(filteredByStatusData);
    }
  }, [status, events]);

  return (
    <section id="events" className="page-section col-center">
      <div className="col-center">
        <SectionHeader
          title={"our events"}
          description="Stunning events and fests organized by us"
        >
          <PrimaryBtn link="/activities?tag=Event" name="See All">
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
              {statusLink.charAt(0).toUpperCase() + statusLink.slice(1)}
            </button>
          ))}
        </div>

        <div ref={eventSwiperRef} className="events-container">
          {isLoading ? (
            <Loader />
          ) : (
            <EventSwiper filteredEvents={filteredEvents} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;
