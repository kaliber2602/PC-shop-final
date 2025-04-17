import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Menu from "./menu";

import Displayproduct from "./Displayproduct"
import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
< link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
/>;
const ProductCategoryBody = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <div>
      <Swiper
        spaceBetween={15}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        onSlideChange={() => console.log('slide change')}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide><img src="Home_image/1.webp" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/2.webp" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/3.webp" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/4.jpeg" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>
        <SwiperSlide><img src="Home_image/5.jpeg" alt="First slide" style={{ height: "100%", width: "100%", objectFit: "cover" }} /></SwiperSlide>

      </Swiper>

      <section className="container-fluid pt-4">
        <div className="row">
          <Menu onSelectCategory={setSelectedCategory} />
          <Displayproduct selectedCategory={selectedCategory} />
        </div>
      </section>


    </div>
  );
};

export default ProductCategoryBody;
