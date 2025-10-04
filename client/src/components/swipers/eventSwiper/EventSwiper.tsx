import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import type { Event } from "@/types/activityTypes";
import Empty from "@/components/ui/empty/Empty";
import EventCard from "@/components/home/events/eventCard/EventCard";

import "./eventSwiper.css";

export default function EventSwiper({
  filteredEvents,
}: {
  filteredEvents: Event[];
}) {
  if (filteredEvents?.length === 0) {
    return <Empty />;
  }

  return (
    <Swiper
      modules={[Autoplay]}
      slidesPerView={"auto"}
      grabCursor={true}
      speed={400}
      spaceBetween={20}
      autoplay={{
        delay: 4000,
      }}
      breakpoints={{
        1200: {
          spaceBetween: 30,
        },
        1600: {
          spaceBetween: 20,
          autoplay: {
            delay: 3000,
          },
        },
      }}
      className="event-swiper"
    >
      {filteredEvents?.map((event) => (
        <SwiperSlide className="activity-demo" key={event._id + "event"}>
          <EventCard eventData={event} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
