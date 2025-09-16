import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Keyboard, Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Post } from "../../types/post";
import PostModal from "../PostModal/PostModal";
import "./Carousel.scss";
import { usePosts } from "../../store/post";


export default function Carrosel () {
  const { posts } = usePosts();
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  console.log(posts);
  const handleOpen = (post: Post) => {
    setSelectedPost(post);
    setOpen(true);
  };
  return (
    <>
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
          {posts.slice(0, 5).map((post) => (
            <SwiperSlide key={post.id}>
              <div
                className="slide-content"
                style={{ backgroundImage: `url("${post.image}")` }}
              >
                <div className="slide-overlay">
                  <div className="slide-title">
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <button
                      className="btn-slide"
                      onClick={() => handleOpen(post)}
                    >
                      Ir para Atividade →
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {selectedPost && (
        <PostModal
          open={open}
          onClose={() => setOpen(false)}
          initialValues={selectedPost}
        />
      )}
    </>
  );
}