import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';


const Home_body = () => {
  return (
    <section>
      <Swiper
        spaceBetween={15}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        // console.log('slide change')
        onSlideChange={() => {}}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide><img src="Home_image/1.webp" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/2.webp" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/3.webp" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/4.jpeg" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/5.jpeg" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>

      </Swiper>
      <div className="container">
        <section className="intro-section">
          <div className="intro-container">
            <h1>Welcome to our PC Hardware Store</h1>
            <p>
              Your Ultimate Destination for Quality Computer Components! Whether you're a passionate gamer,
              a creative professional, or just looking to upgrade your system, we’ve got everything you need –
              from powerful CPUs and graphics cards to sleek cases and accessories.
            </p>
            <p>
              Explore our wide range of high-performance products, enjoy competitive prices, and experience
              customer service that puts you first.
            </p>
            <p className="tagline">Build smarter. Upgrade faster. Shop with confidence.</p>
          </div>
        </section>
      </div>

      <div className="container">
        <div className="row">
          <video width="100%" height="auto" autoPlay loop muted controls>
            <source src="Home_image/video.mp4" type="video/mp4" />
            Your browser doesn't support this video.
          </video>
        </div>
      </div>

      <div className="container">
        <section className="intro-section">
          <div className="intro-container">
            <h1>Explore our products</h1>

          </div>
        </section>
      </div>

      <Swiper
        spaceBetween={10}
        slidesPerView={5}
        pagination={{ clickable: true }}
        navigation
        autoplay
        // console.log('slide change')
        onSlideChange={() => {}}
        modules={[Autoplay, Navigation, Pagination]}
        // console.log(swiper)
        onSwiper={(swiper) => {}}
      >
        <SwiperSlide><img src="Home_image/Home_products/1.png" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/Home_products/2.png" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/Home_products/3.png" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/Home_products/4.jpg" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/Home_products/5.png" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/Home_products/6.png" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/Home_products/7.png" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/Home_products/8.png" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>

      </Swiper>


    </section >
  );
};

export default Home_body;
