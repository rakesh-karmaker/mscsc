import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./HeroImageSwiper.css";
const HeroImageSwiper = () => {
  return (
    <div className="images-container">
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        grabCursor={true}
        speed={400}
        spaceBetween={0}
        autoplay={{
          delay: 5000, // autoplay delay in milliseconds
          disableOnInteraction: false, // don't stop autoplay on user interaction
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <SwiperSlide key={index}>
            <img
              src={`/hero-img-${index + 1}.webp`}
              {...(index == 0
                ? { fetchpriority: "high" }
                : { fetchpriority: "low" })}
              rel="preload"
              alt={`hero image ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroImageSwiper;
