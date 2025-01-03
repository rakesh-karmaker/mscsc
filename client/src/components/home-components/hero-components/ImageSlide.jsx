import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "@/components/home-components/hero-components/ImageSlide.css";
const ImageSlider = () => {
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
              alt={`hero image ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
