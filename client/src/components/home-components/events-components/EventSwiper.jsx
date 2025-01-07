import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import Event from "@/components/home-components/events-components/Event";
const EventSwiper = ({ filteredEvents }) => {
  console.log(filteredEvents);
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
          <Event eventData={event} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default EventSwiper;
