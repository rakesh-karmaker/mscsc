import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import Event from "./Event";
const EventSwiper = ({ filterEventsData }) => {
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
      {filterEventsData.map((event) => (
        <SwiperSlide className="activity-demo" key={event.activityTitle}>
          <Event eventData={event} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default EventSwiper;
