import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "./ImageSlide.css";
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
        <SwiperSlide>
          <img src="/hero-img-1.jpg" alt="hero image 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/hero-img-2.png" alt="hero image 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/hero-img-3.png" alt="hero image 3" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ImageSlider;
