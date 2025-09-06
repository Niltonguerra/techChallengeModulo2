import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Carousel.scss";
import type { Post } from "../../types/post";

interface CarroselProps {
  posts: Post[];
}

export default function Carrosel({ posts }: CarroselProps) {
  return (
    <div className="carrosel-container">
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={{ clickable: true }}
        mousewheel={true}
        keyboard={true}
        autoplay={{ delay: 5000 }}
        loop={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
        className="mySwiper"
      >
        {posts.slice(0,5).map((post) => (
          <SwiperSlide key={post.id}>
            <div
              className="slide-content"
              style={{ backgroundImage: `url("${post.image}")` }}
            >
              <div className="slide-overlay">
                <div className="slide-title">
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                  <a href="#" className="btn-slide">
                    Ir para Atividade →
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}