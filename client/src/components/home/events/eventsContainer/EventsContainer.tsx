import Loader from "@/components/ui/loader/Loader";
import PrimaryBtn from "@/components/ui/PrimaryBtn";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Event } from "@/types/activityTypes";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import EventSwiper from "@/components/swipers/eventSwiper/EventSwiper";

import "./eventsContainer.css";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function EventsContainer({
  events,
  isLoading,
}: {
  events: Event[];
  isLoading: boolean;
}): ReactNode {
  const eventStatuses = ["happened", "all", "upcoming"];
  const [status, setStatus] = useState("all");
  const eventSwiperRef = useRef(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

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

        <div
          ref={eventSwiperRef}
          className="events-container"
          style={{ height: isLoading ? "300px" : "auto" }}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <EventSwiper filteredEvents={filteredEvents} />
          )}
        </div>
      </div>
    </section>
  );
}
