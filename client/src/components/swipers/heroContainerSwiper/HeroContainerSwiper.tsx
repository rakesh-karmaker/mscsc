import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import type { ReactNode } from "react";

import "./heroContainerSwiper.css";

export default function HeroContainerSwiper(): ReactNode {
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
            <LazyLoadImage
              src={`/hero-img-${index + 1}.webp`}
              {...(index == 0
                ? { fetchPriority: "high" }
                : { fetchPriority: "low" })}
              alt={`hero image ${index + 1}`}
              effect="blur"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
